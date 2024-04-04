import {
  cardHeaderColorPrimary,
  cardStyleInner,
} from "../../components/Layout/tailwindStyles";
import ListView from "../../components/ListView";
import {
  Connection,
  getConnectionName,
  hideFields,
  localizeConnectionKey,
} from "../../model/Connection";

export default function Connectionetails({
  connection,
}: {
  connection: Connection;
}) {
  const layout = "pl-3 pt-3";
  return (
    <>
      <div className={"text-left " + cardStyleInner}>
        <div
          className={`${layout} ${cardHeaderColorPrimary} pb-1 rounded-t-lg text-white`}
        >
          <h3 className={"text-base font-bold leading-7"}>
            {getConnectionName(connection)}
          </h3>
          <p
            className="mt-1 
           text-sm leading-6 text-white-400"
          >
            Verbindungsdetails
          </p>
        </div>
        <div
          className={layout + " border-t border-gray-200 dark:border-gray-600"}
        >
          <ListView
            data={connection}
            hideFields={hideFields}
            localizeFunction={localizeConnectionKey}
            disclosure={true}
          />
          {/*  */}
        </div>
      </div>
    </>
  );
}
