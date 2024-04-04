import ActionBar from "../../components/ActionBar";
import Callout from "../../components/Callout";
import Card from "../../components/Card";
import actionBarElementCables from "./actionMenuCable";

export default function CableHelpCard() {
  return (
    <>
      <ActionBar
        actionList={actionBarElementCables}
        highlight="Hilfe"
        settings={{ showMoreButtonGreaterThen: 5 }}
      />
      <div className="text-black">
        <Card
          data={{
            name: "Kabel Hilfe",
            nameColor: "text-slate-50",
            // subname: "Hilfe",
            subnameColor: "text-slate-600",
            // color: "bg-gradient-to-t from-green-500 to-green-700",
            color: "bg-green-500",
          }}
        >
          <h1 className={"font-bold text-xl mb-2"}>Inhaltsverzeichnis</h1>
          <div className="text-base mb-2">
            <ul className="list-disc mx-5 text-sm">
              <li>
                <a href="#addCable">Kabel anlegen</a>
              </li>
            </ul>
          </div>
          <h1 className={"font-bold text-xl mb-2"}>Übersicht</h1>
          <div className="text-base">
            Das Kabelverwaltungssystem ermöglicht die Dokumentation der
            physikalischen Verkabelung. Hier können alle Kabelstrukturen erfasst
            werden. Jedes Kabel verfügt dabei über eine Start- und Endlokation.{" "}
          </div>

          <h1 className={"font-bold text-lg mb-1 mt-4"} id="addCable">
            Kabel anlegen
          </h1>
          <div>
            Ein neues Kabel kann durch Anklicken von "Kabel" - "neues Kabel"
            angelegt werden.
            <Callout data={{ type: "info" }}>
              alle Eingabefelder die mit einem roten Stern markiert sind müssen
              ausgefüllt werden. Die restelichen Felder sind optional
            </Callout>
            <ul className="list-disc mx-5 mt-4 text-sm">
              <li>
                <span className="font-bold">Klasse:</span> Wähle zwischen
                eigener Infrastruktur oder Fremdeinkauf
              </li>
              <li>
                <span className="font-bold">Type:</span> Kabeltyp
              </li>
            </ul>
          </div>
          <div className="mb-2">...</div>
        </Card>
      </div>
    </>
  );
}
