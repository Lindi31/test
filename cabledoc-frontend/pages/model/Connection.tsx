import { z } from "zod";
import {
  apiDeleteCall,
  apiGetCall,
  apiPostCall,
  apiPutCall,
} from "../../app/api/axios";
import { User } from "../../app/api/user";
import { useQuery } from "@tanstack/react-query";
import { CableType } from "./Cable";

//=============Shema=================
export type ConnectionFormProps = {
  setError?: (error: string) => void; //it is defined in Error Wrapper
  defaultValues: ConnectionFormValues;
  // onSubmit: (values: CableFormValues, e?: React.FormEvent) => void;
  onSubmit: (values: ConnectionFormValues) => void;
  optionLists: {
    terminationContainerList: { name: string; id: string }[];
  };
  isSubmitting: boolean;
  isEditForm?: boolean;
};

//=============Shema=================
export type connectionStatusType =
  | "AKTIV"
  | "FREI"
  | "OFFEN"
  | "GEPLANT"
  | "RESERVIERT";

export const connectionStatus: connectionStatusType[] = [
  "AKTIV",
  "FREI",
  "OFFEN",
  "GEPLANT",
  "RESERVIERT",
];

export const fiberCounts = [1, 2, 6, 8, 12, 24, 48];

export type TerminationsMap = [number, number][];

export type Connection = {
  id: number;
  fiberCount?: number | null;
  terminationsMap?: TerminationsMap[] | null;
  start?: number | null; //TerminationContainer-ID
  end?: number | null; //TerminationContainer-ID
  status?: string;
  type?: CableType;
  comment?: string | null;
  version?: number | null;
};

//=============ZOD================= |
export const TerminationsMapSchema = z.array(z.tuple([z.number(), z.number()]));

export const connectionSchema = z.object({
  id: z.number().nullable().optional(),
  fiberCount: z.number().nullable().optional(),
  terminationsMap: z.array(TerminationsMapSchema).nullable().optional(),
  start: z.number().nullable().optional(),
  end: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  version: z.number().nullable().optional(),
});
export type ConnectionFormValues = z.infer<typeof connectionSchema>;

//=============Config=================
export const hideFields = ["autoPatchSpliceSuccess", "version", "blocking"];

const localizedStrings: Record<string, Record<string, string>> = {
  de: {
    fiberCount: "Faseranzahl",
    comment: "Kommentar",
    type: "Typ",
  },
};
export function localizeConnectionKey(name: string, lang = "de"): string {
  if (name in localizedStrings[lang]) {
    return localizedStrings[lang]?.[name];
  }
  return name;
}
//========= Individual Connection Funticons =================

export function getConnectionName(data: Connection): string {
  let prefix = "TXX-V.";
  let cableNo = data.id ? data.id.toString().padStart(5, "0") : "";
  let suffix = data.type ? data.type.charAt(0).toUpperCase() : "";

  return prefix + cableNo + "." + suffix;
}
//========= API Calls =================
const serverPath = import.meta.env.VITE_API_URL;

//Get

/**
 * getConnections
 * Gibt eine Liste aller Verbindungen aus
 * @param user
 * @returns
 */
export async function getConnections(user: User) {
  let path = serverPath + "Connection";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * getConnectionsQuery
 * Gibt eine Query-Object mit allen Verbindungen zurück
 * @param user
 * @returns
 */
export function getConnectionsQuery(user: User) {
  return useQuery<Connection>({
    queryKey: ["connections"],
    queryFn: async () => {
      try {
        const data = await getConnections(user);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
}
/**
 * getConnection
Gibt die Verbiundung mit angegebener ID aus
 * @param user
 * @param id Connection Id
 * @returns
 */
export async function getConnection(user: User, id: number) {
  let path = serverPath + "Connection/" + id;
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * getConnectionQuery
 * Gibt eine Query-Object einer Verbiundung mit angegebener ID aus
 * @param user
 * @returns
 */
export function getConnectionQuery(user: User, id: number) {
  return useQuery<Connection>({
    queryKey: ["connection", id],
    queryFn: async () => {
      try {
        const data = await getConnection(user, id);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
}

//Post
/**
 * Erstellt eine neue Verbindung. Es werden keine Teilstucke hinzugefügt.  
Request-Body: Das zu Erstellende Connection-Objekt  
Response-Body: Bearbeitetes Connection-Objekt
 * @param user 
 * @param connection 
 * @returns 
 */
export async function addConnection(user: User, connection: Connection) {
  let path = serverPath + "Connection";
  try {
    const result = await apiPostCall(user, path, connection);
    return result;
  } catch (error) {
    throw error;
  }
}

//PUT
/**
 * Bearbeitet eine bestehende Verbindung. Teilstücke werden nicht verändert.  
Request-Body: Connection-Objekt  
Response-Body: Bearbeitetes Connection-Objekt
 * @param user 
 * @param connection 
 * @returns 
 */
export async function editConnection(user: User, connection: Connection) {
  let path = serverPath + "Connection";
  try {
    const result = await apiPutCall(user, path, connection);
    return result;
  } catch (error) {
    throw error;
  }
}
/**
 * earbeitet die Teilstücke der Verbindung mit der angegebenen ID.
 * @param user
 * @param body List<List<Integer>>
 * Integer: Termination-ID. FAlls unbekanntes Teilstück, kann NULL verwendet werden.
 * Äußere Liste: geordete Liste, welche die Reihenfolge der parallelen Fasern repräsentiert. Anzahl Einträge = Anzahl der parallelen Fasern der Verbindung.
 * Innere Liste: geordnete Liste der Terminations der der Fasern, die jeweils näher am Start liegen. Diese Listen müssen alle dieselbe Anzahl an Einträgen haben.
 * @param id
 * @example: Verbindung, 3 Teilstücke lang, besetehend aus 2 parallelen Fasern.
 * t=Termination (mit Angabe der ID), f=Faser, p=Patch/Spleiß
 * (start)----- Richtung der Verbindung ----->(end)
 * t1--(f)--t2--(p)--t3--(f)--t4--(p)--t5--(f)--t6
 * t7--(f)--t8--(p)--t9--(f)--t10-(p)--t11-(f)--t12
 * ```
 *
 * Body:
 *
 * ```
 * [
 * 	[1,7],
 * 	[3,9],
 * 	[5,11]
 * ]
 * @returns
 */
export async function editConnectionPart(user: User, body: any[], id: number) {
  let path = serverPath + "Connection/Parts/" + id;
  try {
    const result = await apiPutCall(user, path, body);
    return result;
  } catch (error) {
    throw error;
  }
}
//Delete
/**
 * Löscht die Verbindung mit angegebener ID.

 * @param user 
 * @param id 
 * @returns 
 */
export async function deleteConnection(user: User, id: number) {
  let path = serverPath + "Connection/" + id;
  try {
    const result = await apiDeleteCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
