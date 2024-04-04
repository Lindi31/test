"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactTable from "@/pages/pages/table/ReactTable"; // Stellen Sie sicher, dass der Dateipfad korrekt ist
import { fetchLocations } from "@/app/api/cableApi"; // Importieren Sie die Funktion getLocations, um Kabel abzurufen
import { User } from "@/app/api/user";
import { createColumnHelper } from "@tanstack/react-table";
import { Locateable } from "@/pages/model/Location";
import { formatDate } from "@/pages/ressources/functions";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSkeleton from "@/pages/components/LoadingIndicator";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { cardStyleInner } from "@/pages/components/Layout/tailwindStyles";
interface AllUserProps {
  user: User;
}

const AllLocations: React.FC<AllUserProps> = ({ user }) => {
  const [locations, setLocations] = useState([]); // State für die Kabel initialisieren
  const [loading, setLoading] = useState(true); // State für den Ladezustand hinzufügen

  // Daten abrufen, wenn die Komponente montiert wird
  useEffect(() => {
    async function fetchCable() {
      try {
        // Hier die Logik einfügen, um Kabel abzurufen, z.B. getLocations-Funktion aufrufena
        const locationsData = await fetchLocations(user); // Annahme: getLocations gibt die Kabeldaten zurück
        setLocations(locationsData);
        setLoading(false); // Kabeldaten im State setzen
      } catch (error) {
        console.error("Error fetching Locations:", error);
        setLoading(false);
      }
    }
    fetchCable();
  }, []); // Leeres Array als Abhängigkeiten, um sicherzustellen, dass der Effekt nur einmal ausgeführt wird

  // Spaltenkonfiguration für die Tabelle
  const columnHelper = createColumnHelper<Locateable>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
        filterFn: "includesString",
      }),
      columnHelper.accessor("type", {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
        // filterFn: 'fuzzy',
        filterFn: "includesString",
      }),

      columnHelper.accessor((row) => row.comment, {
        id: "comment",
        cell: (info) => <i>{info.getValue()}</i>,
        header: () => <span>Kommentar</span>,
        footer: (info) => info.column.id,
        filterFn: "includesString",
      }),
      columnHelper.group({
        id: "Address",
        header: () => <span>Adresse</span>,
        // footer: (props) => props.column.id,
        columns: [
          columnHelper.accessor("ort", {
            cell: (info) => info.getValue(),
            header: () => <span>Ort</span>,
            footer: (props) => props.column.id,
            filterFn: "includesString",
          }),
          columnHelper.accessor("plz", {
            cell: (info) => info.getValue(),
            header: () => <span>plz</span>,
            footer: (props) => props.column.id,
            filterFn: "includesString",
          }),
          columnHelper.accessor((row) => row.strasse, {
            id: "strasse",
            cell: (info) => info.getValue(),
            header: () => <span>Strasse</span>,
            footer: (props) => props.column.id,
            filterFn: "includesString",
          }),
          columnHelper.accessor((row) => row.hausNr, {
            id: "hausNr",
            cell: (info) => info.getValue(),
            header: () => <span>HausNr.</span>,
            footer: (props) => props.column.id,
            filterFn: "includesString",
          }),
        ],
      }),
      columnHelper.accessor((row) => formatDate(row.lastModifiedAt as any), {
        id: "Geändert",
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Geändert</span>,
        footer: (info) => info.column.id,
        filterFn: "includesString",
      }),
    ],
    []
  );

  const renderLoadingSkeleton = () => (
    <div className="items-center">
      {/* Hier kannst du so viele Skeleton-Komponenten rendern, wie du für die Ladeanzeige benötigst */}

      <CardContent className="w-[1200px] h-[1200px]">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </CardContent>
    </div>
  );
  const layout = "p-3";
  return (
    <>
      <div className={"text-left h-fit w-full " + cardStyleInner}>
        <div className={layout + " pl-9"}>
          <h3 className="text-base font-semibold leading-7">
            Standort Übersicht
          </h3>
          <p
            className="mt-1 
           text-sm leading-6 text-gray-400"
          >
            Liste aller Standorte
          </p>
        </div>
        <div
          className={
            layout + " mt-2 border-t border-gray-100 dark:border-gray-600"
          }
        >
          <div className="p-2">
            {loading ? (
              renderLoadingSkeleton()
            ) : (
              <>
                <CardContent className="p-3 self-center items-center">
                  <ReactTable data={locations} columns={columns} />
                </CardContent>
              </>
            )}
          </div>
        </div>
        <Toaster
          position="top-center"
          gutter={24}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
    </>
  );
};
export default AllLocations;
