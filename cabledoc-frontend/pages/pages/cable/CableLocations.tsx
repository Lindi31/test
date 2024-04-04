import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  cardHeaderThird,
  cardStyleInner,
} from "../../components/Layout/tailwindStyles";
import { Cable, localizeCableKey } from "../../model/Cable";
import { localizeCableRackKey } from "../../model/CableRack";
import { LocateableAddress, getLocationAddress } from "../../model/Location";
import { User } from "../../../app/api/user";
import CableListElementDisclosure from "./CableListElementDisclosure";

export default function CableLocations({ cable }: { cable: Cable }) {
  const [locations, setLocations] = useState<LocateableAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user: User = useOutletContext();

  useEffect(() => {
    const fetch = async () => {
      if (!cable.fibers) {
        return;
      }
      setLoading(true);
      if (
        cable.cableRack &&
        cable.cableRack[0].terminationContainer &&
        cable.cableRack[1].terminationContainer
      ) {
        const locA = await getLocationAddress(
          user,
          cable.cableRack[0].terminationContainer
        );
        const locB = await getLocationAddress(
          user,
          cable.cableRack[1].terminationContainer
        );
        setLocations([locA, locB]);
      }
      setLoading(false);
    };

    fetch();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const layout = "pl-3 pt-3";
  // const mappingAB = ["A", "B"];
  return (
    <>
      <div className={"text-left " + cardStyleInner}>
        <div
          className={`${layout} ${cardHeaderThird} pb-1 rounded-t-lg text-white`}
        >
          <h3 className={"text-base font-bold leading-7"}>{"Lokationen"}</h3>
          <p
            className="mt-1 
           text-sm leading-6 text-white-400"
          >
            Kabel End Punkte
          </p>
        </div>
        <div
          className={
            layout + " pt-2 border-t border-gray-200 dark:border-gray-600"
          }
        >
          <dl className={`mr-3 mb-3`}>
            {cable.cableRack &&
              cable.cableRack.map((cableRack, index) => (
                <div key={index} className={"border rounded-lg mb-3"}>
                  <div
                    className={`py-1 text-white bg-rose-taupe-light  rounded-t-lg p-2`}
                  >
                    {"Lokation "}
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-600 p-2">
                    {/* ===TerminationContainer=== */}
                    <div
                      className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-3 sm:px-0"
                      key={cableRack.id + "TerminationContainer"}
                    >
                      <div className="text-sm font-bold leading-6">
                        {localizeCableRackKey("terminationContainer")}
                      </div>
                      <div className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                        {cableRack.terminationContainer}
                      </div>
                    </div>
                    {/* ===CableName=== */}
                    <div
                      className="px-4 py-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0"
                      key={cableRack.id + "CableName"}
                    >
                      <div className="text-sm font-bold leading-6">
                        {localizeCableRackKey("cableName")}
                      </div>
                      <div className="mt-1 text-sm leading-6 sm:col-span-3 sm:mt-0">
                        {cableRack.cableName}
                      </div>
                    </div>

                    {/* ===Comment=== */}
                    <div
                      className="px-4 py-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0"
                      key={cableRack.id + "Comment"}
                    >
                      <div className="text-sm font-bold leading-6">
                        {localizeCableRackKey("comment")}
                      </div>
                      <div className="mt-1 text-sm leading-6 sm:col-span-3 sm:mt-0">
                        {cableRack.comment}
                      </div>
                    </div>
                    {/* ===LocationName=== */}
                    <div
                      className="px-4 py-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0"
                      key={cableRack.id + "Name"}
                    >
                      <div className="text-sm font-bold leading-6">
                        {localizeCableRackKey("Anschrift")}
                      </div>
                      <div className="mt-1 text-sm leading-6 sm:col-span-3 sm:mt-0">
                        {locations[index].location.name}
                        <br />
                        {locations[index].location.plz +
                          " " +
                          locations[index].location.ort}
                        <br />
                        {locations[index].location.strasse}
                      </div>
                    </div>

                    {/* ===Unterobjekte=== */}
                    <CableListElementDisclosure
                      data={{
                        name: localizeCableKey("Unterobjekte"),
                        content: locations[index].children,
                      }}
                      localizeFunction={localizeCableKey}
                      defaultOpen={true}
                    />
                  </div>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </>
  );
}
