import { useEffect, useState } from "react";
import { Params, useOutletContext, useParams } from "react-router-dom";
import { User } from "../../../app/api/user";
import ActionBar from "../../components/ActionBar";
import { replacePathPlaceholders } from "../../ressources/functions";
import { Cable, getCable } from "../../model/Cable";
import actionBarElementCables from "./actionMenuCable";
import CableDetails from "./CableDetails";
import CableFibers from "./CableFibers";
import CableLocations from "./CableLocations";

export default function ShowCable() {
  const [cableData, setCable] = useState<Cable | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<Params>();
  const user: User = useOutletContext();

  useEffect(() => {
    setLoading(true);
    const fetchCable = async () => {
      try {
        const response = await getCable(user, Number(params.id));
        // console.log(response);

        setCable(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cable:", error);
        setLoading(false);
      }
    };

    fetchCable();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cableData) {
    return <div>No cable data found.</div>;
  }
  return (
    <>
      <ActionBar
        actionList={replacePathPlaceholders(actionBarElementCables, {
          id: Number(params.id),
        })}
        highlight="show"
        settings={{ showMoreButtonGreaterThen: 5 }}
      />

      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <div className="h-fit w-full">
          <CableDetails cable={cableData} />
        </div>
        <div className="row-span-2 h-fit w-full">
          {" "}
          <CableLocations cable={cableData} />
        </div>
        <div className="row-start-2">
          <CableFibers cable={cableData} />
        </div>
      </div>
    </>
  );
}
