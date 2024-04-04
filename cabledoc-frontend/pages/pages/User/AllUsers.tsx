import { useEffect, useState } from "react";
import { Users, getUsers } from "../../model/User";
import Table from "../Table";
import { useOutletContext } from "react-router-dom";
import { User } from "../../../app/api/user";

export default function AllUser() {
  const [users, setUsers] = useState<Users | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user: User = useOutletContext();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUsers(user);
      setUsers(response);

      try {
        const response = await getUsers(user);
        if (!active) {
          return;
        }
        setUsers(response);
        setLoading(false);
        console.log(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    setLoading(false);

    let active = true;
    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!users) {
    return <div>No user data found.</div>;
  }

  const layout = "p-3";

  return (
    <>
      <div className="text-left w-fit border-separate">
        <div className={layout}>
          <h3 className="text-base font-semibold leading-7">User Übersicht</h3>
          <p
            className="mt-1 
           text-sm leading-6 text-gray-400"
          >
            User Informationen
          </p>
        </div>
        <div
          className={
            layout + " mt-2 border-t border-gray-100 dark:border-gray-600"
          }
        >
          <Table data={users} />
        </div>
      </div>
    </>
  );
}
