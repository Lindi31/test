import { useEffect, useState } from "react";
import { Params, useOutletContext, useParams } from "react-router-dom";
import { Locateable, getFullLocation } from "../../model/Location";
import LocationDetails from "./LocationDetails";
import LocationMap from "./LocationMap";
import { cardStyleOuter } from "../../components/Layout/tailwindStyles";
import LocationObject from "./LocationObject";
import {
  findObjectById,
  replacePathPlaceholders,
} from "../../ressources/functions";
import { User } from "../../../app/api/user";
import DraggableList from "./DraggableList";
import ActionBar from "../../components/ActionBar";
import actionBarElements from "./actionMenuLocation";
import LocationChildren from "./LocationChildren";

export default function ShowLocation() {
  const [location, setLocation] = useState<Locateable | null>(null);
  const [locationDetails, setLocationDetails] = useState<Locateable | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditable, setIsEditable] = useState(false);

  const params = useParams<Params>();
  const user: User = useOutletContext();

  useEffect(() => {
    const fetchloaction = async () => {
      try {
        // const response = await getFakeLocation(Number(params.id));
        // const response = await getLocations();

        // const response = await getLocation(user, Number(params.id));
        // const response = await getSpecificLocations(user, [2, 5, 12]);
        const response = await getFullLocation(user, Number(params.id));
        const locationDetail = await findObjectById(
          response,
          Number(params.id)
        );

        setLocation(response);
        setLocationDetails(locationDetail);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching loaction:", error);
        setLoading(false);
      }
    };
    fetchloaction();
  }, []);

  const toggleIsEditable = () => {
    setIsEditable((prevValue) => !prevValue);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!location) {
    return <div>No loaction data found.</div>;
  }

  console.log(Number(params.id) === location.id);

  let colstartChildren =
    Number(params.id) === location.id
      ? "col-start-2 row-start-1"
      : "col-start-3 row-start-2";

  return (
    <>
      <ActionBar
        actionList={replacePathPlaceholders(actionBarElements, {
          id: Number(params.id),
        })}
        highlight="show"
        settings={{ showMoreButtonGreaterThen: 5 }}
      />
      <div className={"grid grid-cols-3 grid-rows-3 gap-4 "}>
        <div className={"h-fit w-full row-span-2"}>
          {location && <LocationDetails location={location} />}
        </div>
        {/* Details */}
        {Number(params.id) !== location.id && (
          <div className={"h-fit w-full row-span-2"}>
            <LocationObject location={locationDetails} />
          </div>
        )}

        {/* Karte */}
        <div className={cardStyleOuter + " col-start-3"}>
          {location?.strasse && location.ort && (
            <LocationMap location={location} />
          )}
        </div>
        {/* Objekte */}
        <div className={colstartChildren}>
          {(location.children?.length ?? 0) >= 1 && (
            <>
              {!isEditable ? (
                <LocationChildren
                  location={location.children}
                  isEditable={isEditable}
                  toggleIsEditable={toggleIsEditable}
                />
              ) : (
                <DraggableList
                  location={location?.children}
                  id={Number(params.id)}
                  isEditable={isEditable}
                  toggleIsEditable={toggleIsEditable}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
