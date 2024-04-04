import { useEffect, useState } from "react";
import { Params, useOutletContext, useParams } from "react-router-dom";
import { User } from "../../../app/api/user";
import ActionBar from "../../components/ActionBar";
import { replacePathPlaceholders } from "../../ressources/functions";
import { Connection, getConnection } from "../../model/Connection";
import actionBarElementConnections from "./actionMenuConnection";
import ConnectionDetails from "./ConnectionDetails";

export default function ShowConnection() {
  const [connectionData, setConnection] = useState<Connection | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<Params>();
  const user: User = useOutletContext();

  useEffect(() => {
    setLoading(true);
    const fetchConnection = async () => {
      try {
        const response = await getConnection(user, Number(params.id));
        // console.log(response);

        setConnection(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching connection:", error);
        setLoading(false);
      }
    };

    fetchConnection();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!connectionData) {
    return <div>No connection data found.</div>;
  }

  console.log(connectionData);

  return (
    <>
      <ActionBar
        actionList={replacePathPlaceholders(actionBarElementConnections, {
          id: Number(params.id),
        })}
        highlight="show"
        settings={{ showMoreButtonGreaterThen: 8 }}
      />

      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <div className="h-fit w-full">
          <ConnectionDetails connection={connectionData} />
        </div>
        <div className="row-span-2 h-fit w-full"></div>
        <div className="row-start-2"></div>
      </div>
    </>
  );
}
