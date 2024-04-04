import { useEffect, useState } from "react";
import { getUser, hideFields, localizeUserKey } from "../../model/User";
import { Params, useOutletContext, useParams } from "react-router-dom";
import { User } from "../../../app/api/user";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import ActionBar from "../../components/ActionBar";
import { replacePathPlaceholders } from "../../ressources/functions";
import actionBarElementsUser from "./actionMenuUser";

export default function ShowUser() {
  const [userData, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<Params>();
  const user: User = useOutletContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(user, Number(params.id));
        setUser(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found.</div>;
  }
  const layout = "pl-3 pt-3";
  return (
    <>
      <ActionBar
        actionList={replacePathPlaceholders(actionBarElementsUser, {
          id: Number(params.id),
        })}
        highlight="show"
        settings={{ showMoreButtonGreaterThen: 5 }}
      />
      <div className={"text-left " + cardStyleInner}>
        <div className={layout}>
          <h3 className={"text-base font-bold leading-7"}>{user.name}</h3>
          <p
            className="mt-1 
           text-sm leading-6 text-gray-400"
          >
            User Details
          </p>
        </div>
        <div
          className={
            layout + " mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"
          }
        >
          <dl className="divide-y divide-gray-100 dark:divide-gray-600">
            {Object.entries(userData).map(
              ([key, value]) =>
                !hideFields.includes(key) &&
                value !== null && (
                  <div
                    key={key}
                    className="px-4 py-3 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0"
                  >
                    <dt className="text-sm font-medium leading-6">
                      {localizeUserKey(key)}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {renderValue(value)}
                    </dd>
                  </div>
                )
            )}
          </dl>
        </div>
      </div>
    </>
  );
}

function renderValue(value: any, depth: number = 0): JSX.Element {
  if (typeof value === "object" && value !== null) {
    return (
      <div>
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className={depth > 0 ? "ml-4" : ""}>
            <strong>{localizeUserKey(key)}: </strong>
            {renderValue(val, ++depth)}
          </div>
        ))}
      </div>
    );
  } else {
    return <div>{String(value)}</div>;
  }
}
