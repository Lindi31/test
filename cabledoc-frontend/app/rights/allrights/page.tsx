"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactTable from "@/pages/pages/table/ReactTable"; // Stellen Sie sicher, dass der Dateipfad korrekt ist
import { User } from "@/app/api/user";
import { createColumnHelper } from "@tanstack/react-table";

import { Right, getRights, localizeRightKey } from "@/pages/model/Right";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface AllUserProps {
  user: User;
}

const AllCables: React.FC<AllUserProps> = ({ user }) => {
  const [cables, setCables] = useState([]); // State für die Kabel initialisieren
  console.log(cables);

  // Daten abrufen, wenn die Komponente montiert wird
  useEffect(() => {
    async function fetchCable() {
      try {
        // Hier die Logik einfügen, um Kabel abzurufen, z.B. getCables-Funktion aufrufena
        const cablesData = await getRights(user); // Annahme: getCables gibt die Kabeldaten zurück
        setCables(cablesData); // Kabeldaten im State setzen
      } catch (error) {
        console.error("Error fetching cables:", error);
      }
    }
    fetchCable();
  }, []); // Leeres Array als Abhängigkeiten, um sicherzustellen, dass der Effekt nur einmal ausgeführt wird

  // Spaltenkonfiguration für die Tabelle
  const columnHelper = createColumnHelper<Right>();

  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: (info) => localizeRightKey(info.column.id),
      footer: (info) => localizeRightKey(info.column.id),
    }),
  ];
  return (
    <>
      <Card className={cn("shadow-2xl")}>
        <CardContent className="p-3">
          <h1>All Rights</h1>
          {cables.length > 0 && <ReactTable data={cables} columns={columns} />}
        </CardContent>
      </Card>
    </>
  );
};
export default AllCables;
