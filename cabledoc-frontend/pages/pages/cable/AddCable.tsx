import { Toaster } from "react-hot-toast";
import ActionBar from "../../components/ActionBar";
import Callout from "../../components/Callout";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import { replacePathPlaceholders } from "../../ressources/functions";
import actionBarElementCables from "./actionMenuCable";
import DataFechterAdd from "./DataFechterAdd";
import ErrorWrapper from "../../components/ErrorWrapper";
import { useState } from "react";

export default function AddCable() {
  const [error, setError] = useState<string[]>([]);

  const layout = "p-3 text-left";
  const width = "max-w-3xl";

  return (
    <>
      <ActionBar
        actionList={replacePathPlaceholders(actionBarElementCables, {})}
        highlight="add"
        settings={{ showMoreButtonGreaterThen: 5 }}
      />

      <Callout className={width} data={{ type: "info", heading: true }}>
        Bei Fremdkabel können nur zwei Fasern angelegt werden.
      </Callout>
      <ErrorWrapper error={error} width={width} />
      <div className={layout + " " + cardStyleInner + " " + width}>
        <h1 className="text-2xl font-bold mb-4">{`neues Kabel anlegen`}</h1>
        <div className="AddCable max-w-3xl">
          <DataFechterAdd setError={setError} />
        </div>
        <Toaster />
      </div>
    </>
  );
}
