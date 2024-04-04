import {
  cardHeaderColorPrimary,
  cardStyleInner,
} from "../../components/Layout/tailwindStyles";
import { Locateable, getLocationSymbols } from "../../model/Location";
import { TreeNode } from "../../ressources/functions";

export default function LocationDetails({
  location,
}: {
  location: Locateable | TreeNode;
}) {
  function renderValue(value: any, depth: number = 0): JSX.Element {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return (
        <div>
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className={depth > 0 ? "ml-4" : ""}>
              <strong>{key}: </strong>
              {renderValue(val, ++depth)}
            </div>
          ))}
        </div>
      );
    } else {
      return <div>{String(value)}</div>;
    }
  }

  const layout = "pl-3 pt-3";
  return (
    <>
      <div className={"text-left " + cardStyleInner}>
        <div
          className={`${layout} ${cardHeaderColorPrimary} pb-1 rounded-t-lg text-white`}
        >
          <h3 className={"text-base font-bold leading-7"}>
            {getLocationSymbols(location.type as string)} {location.name}
          </h3>
          <p className="mt-1 text-sm leading-6 text-white-400">
            Standort Details
          </p>
        </div>
        <div
          className={
            layout + " pt-2 border-t border-gray-200 dark:border-gray-600"
          }
        >
          <dl className="divide-y divide-gray-100 dark:divide-gray-600">
            {Object.entries(location).map(
              ([key, value]) =>
                key !== "children" &&
                value !== null && (
                  <div
                    key={key}
                    className="px-4 py-3 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0"
                  >
                    <dt className="text-sm font-medium leading-6">{key}</dt>
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
