"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import ReactTable from "@/pages/pages/table/ReactTable"; // Stellen Sie sicher, dass der Dateipfad korrekt ist
import { fetchCables } from "@/app/api/cableApi"; // Importieren Sie die Funktion getCables, um Kabel abzurufen
import { User } from "@/app/api/user";
import { createColumnHelper } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import LoadingSkeleton from "@/pages/components/LoadingIndicator";
import { cn } from "@/lib/utils";
import { CardContent } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { cardStyleInner } from "@/pages/components/Layout/tailwindStyles";
interface AllUserProps {
  user: User;
}

const AllCables: React.FC<AllUserProps> = ({ user }) => {
  const [cables, setCables] = useState([]); // State für die Kabel initialisieren
  const [loading, setLoading] = useState(true); // State für den Ladezustand hinzufügen

  useEffect(() => {
    async function fetchCable() {
      try {
        const cablesData = await fetchCables(user);
        setCables(cablesData);
        setLoading(false); // Ladezustand auf false setzen, wenn Daten erfolgreich geladen wurden
      } catch (error) {
        console.error("Error fetching cables:", error);
        setLoading(false); // Auch den Ladezustand auf false setzen, wenn ein Fehler auftritt
      }
    }
    fetchCable();
  }, [user]); // Füge `user` als Abhängigkeit hinzu, um Daten neu zu laden, wenn sich `user` ändert

  // Spaltenkonfiguration für die Tabelle

  const columnHelper = createColumnHelper<User>();

  // Define columns for ReactTable using columnHelper
  const columns = [
    columnHelper.accessor("id", {
      header: () => "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("altName", {
      header: () => "AltName",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cableNo", {
      header: () => "CNO",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("comment", {
      header: () => "Comment",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("length", {
      header: () => "Lenght",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("oldId", {
      header: () => "oldid",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("specification", {
      header: () => "spec",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("type", {
      header: () => "type",
      cell: (info) => info.getValue(),
    }),
  ];

  const renderLoadingSkeleton = () => (
    <div className="p-2">
      {/* Hier kannst du so viele Skeleton-Komponenten rendern, wie du für die Ladeanzeige benötigst */}

      <CardContent className=" h-[1200px] w-full">
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
          <h3 className="text-base font-semibold leading-7">Kabel Übersicht</h3>
          <p
            className="mt-1 
           text-sm leading-6 text-gray-400"
          >
            Liste aller Kabel
          </p>
        </div>
        <div
          className={
            layout + " mt-2 border-t border-gray-100 dark:border-gray-600"
          }
        >
          <div className="p-2 w-full">
            {loading ? (
              renderLoadingSkeleton()
            ) : (
              <>
                <CardContent className="p-3 self-center items-center">
                  <ReactTable data={cables} columns={columns} />
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

export default AllCables;
