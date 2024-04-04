import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import { replacePathPlaceholders } from "../../ressources/functions";
import { Params, useParams } from "react-router-dom";
import ActionBar from "../../components/ActionBar";
import actionBarElementCables from "./actionMenuCable";
import DataFechterEdit from "./DataFechterEdit";
import { Toaster } from "react-hot-toast";
import Callout from "../../components/Callout";
import { useState } from "react";
import ErrorWrapper from "../../components/ErrorWrapper";

//https://www.zachgollwitzer.com/posts/react-forms-best-practices

export default function EditCable() {
  const params = useParams<Params>();
  const [error, setError] = useState<string[]>([]);

  const layout = "p-3 text-left";
  const width = "max-w-3xl";

  return (
    <>
      <ActionBar
        actionList={replacePathPlaceholders(actionBarElementCables, {
          id: Number(params.id),
        })}
        highlight="edit"
        settings={{ showMoreButtonGreaterThen: 5 }}
      />
      <Callout className={width} data={{ type: "info", heading: true }}>
        Achtung derzeit können nur folgende Felder berabeitet werden:
        <ul className="list-disc ml-5">
          <li>Typ</li>
          <li>Kommentar</li>
          <li>altName </li>
          <li>Länge </li>
        </ul>
      </Callout>
      <ErrorWrapper error={error} width={width} />
      <div className={layout + " " + cardStyleInner + " " + width}>
        <h1 className="text-2xl font-bold mb-4">{`Kabel (${params.id}) bearbeiten`}</h1>
        <div className="EditCable max-w-3xl">
          <DataFechterEdit params={params} setError={setError} />
        </div>
        <Toaster />
      </div>
    </>
  );
}
