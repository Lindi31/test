import {
  cardHeaderColorPrimary,
  cardStyleInner,
} from "../../components/Layout/tailwindStyles";
import ListView from "../../components/ListView";
import {
  Cable,
  getCableName,
  hideFields,
  localizeCableKey,
} from "../../model/Cable";

export default function CableDetails({ cable }: { cable: Cable }) {
  const layout = "pl-3 pt-3";
  return (
    <>
      <div className={"text-left " + cardStyleInner}>
        <div
          className={`${layout} ${cardHeaderColorPrimary} pb-1 rounded-t-lg text-white`}
        >
          <h3 className={"text-base font-bold leading-7"}>
            {getCableName(cable)}
          </h3>
          <p
            className="mt-1 
           text-sm leading-6 text-white-400"
          >
            Kabeldetails
          </p>
        </div>
        <div
          className={layout + " border-t border-gray-200 dark:border-gray-600"}
        >
          <ListView
            data={cable}
            hideFields={hideFields}
            localizeFunction={localizeCableKey}
            disclosure={true}
          />
          {/*  */}
        </div>
      </div>
    </>
  );
}
