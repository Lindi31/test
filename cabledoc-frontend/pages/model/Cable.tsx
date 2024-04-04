import { z } from "zod";
import {
  apiDeleteCall,
  apiGetCall,
  apiPatchCall,
  apiPostCall,
} from "../../app/api/axios";
import { User } from "../../app/api/user";
import { CableRack, CableRackSchema } from "./CableRack";
import { Lieferant } from "./Lieferant";
import { useQuery } from "@tanstack/react-query";

//=============Shema=================
export const cableTypes = ["LWL", "KUPFER", "RICHTFUNK"];
export const cableClass = ["OwnCable", "ForeignLine"];
export type CableType = (typeof cableTypes)[number];

export type TerminationType = "PATCH" | "SPLICE" | "UNCUT";
export type FiberStatusType = "FREI" | "DEFEKRT";
export type PatchSpliceStatusType = "VERBUNDEN" | "GEPLANT";

export type PatchSplice = {
  id?: number | null;
  terminations?: Termination | null;
  version?: number | null;
  comment?: string | null;
  connection?: number | null;
  status?: PatchSpliceStatusType | null;
};

export type Termination = {
  port?: number | null;
  pin?: number | null;
  type?: TerminationType | null;
  patchSplice?: string | null;
  connectedTo?: Termination | null;
  container?: string | null;
};
export type FiberTermination = {
  fiber?: number | null;
  fiberNo?: number | null;
  side?: number | null;
};

export type Fiber = {
  id: number | null;
  status?: string | null;
  _class?: string | null;
  terminations?: any[] | null;
  fiberNo?: number | null;
  connectionId?: number | null;
  sequence?: number | null;
  orderInSequence?: number | null;
  alternateConnectionId?: number | null;
  alternateSequence?: number | null;
  alternateOrderInSequence?: number | null;
  valid?: boolean | null;
  cable?: Cable | null | number;
};
export type Cable = {
  id: number | null;
  _class?: string | null; //OwnCable oder ForeignLine
  altName?: string | null;
  comment?: string | null;
  cableNo?: number | null;
  length?: number | null;
  fiberCount?: number | null;
  type?: string | null;
  fullName?: string | null;
  cableRack?: CableRack[] | null;
  fibers?: Fiber[] | null | number[];
  oldId?: number | null;
  //Foreignline Specific
  supplierName?: string | null;
  lieferant?: Lieferant | null;
  prefix?: string | null;
};

export type CableEdit = {
  id: number;
  _class: string;
  fiberCount: number;
  comment?: string;
};
export type Cables = Cable[];

/**
 * defaultValues: Die Standardwerte für das Form
 * onsubmit: function void: Was soll nach dem Submitten der Form geschehen?
 * optionLists: Hier können alle optionen der Select Boxen angegeben werden.
 * isSubmitting: boolean. Abfragen ob das Lades Formulars abgeschlossen ist.
 * isEditForm: boolean. Für das Anlegen und Bearbeiten eines Kabels wird das gleiche Formular Feld verwendet. Damit man unterscheiden kann, ob ein Kabel neu angelegt oder bearbeitet werden soll.
 */
export type FormProps = {
  setError?: (error: string) => void; //it is defined in Error Wrapper
  defaultValues: CableFormValues;
  // onSubmit: (values: CableFormValues, e?: React.FormEvent) => void;
  onSubmit: (values: CableFormValues) => void;
  optionLists: {
    lieferanten: Lieferant[];
    terminationContainerList: { name: string; id: string }[];
  };
  isSubmitting: boolean;
  isEditForm?: boolean;
};
//=============ZOD================= |
// export const numberSchema = z.preprocess(
//   (val) => {
//     if (val === "") {
//       return null;
//     }
//     return parseFloat(val as string);
//   },
//   z
//     .number({
//       required_error: "String must contain at least 1 character(s)",
//     })
//     .nullable()
// );

export const fiberShema = z.object({
  id: z.number().nullable().optional(),
});

// Define the Zod schema for the User type
export const cableSchema = z.object({
  id: z.number().nullable().optional(),
  _class: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  altName: z.string().nullable().optional(),
  // cableNo: numberSchema.nullable().optional(),
  cableNo: z.number().nullable().optional(),
  length: z.number().nullable().optional(),
  // fiberCount: numberSchema.optional(),
  // fiberCount: z.coerce
  //   .number({
  //     required_error: "fiberCount is required",
  //     invalid_type_error: "fiberCount must be a number",
  //   }),
  fiberCount: z.number({
    required_error: "fiberCount is required",
    invalid_type_error: "Bitte eine Nummer eingeben",
  }),
  type: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  // cableRack: cableRackArraySchema.nullable().optional(),
  cableRack: z.tuple([CableRackSchema, CableRackSchema]).nullable().optional(),
  fibers: z.array(fiberShema).nullable().optional(),
  oldId: z.number().nullable().optional(),
  //Foreignline Specific
  supplierName: z.string().nullable().optional(),
  // lieferant: LieferantSchema.nullable().optional(),
  lieferant: z.number().nullable().optional(),
  prefix: z.string().nullable().optional(),
});

export const validateCableFormData = (inputs: unknown) => {
  try {
    const isValidData = cableSchema.parse(inputs);
    return isValidData;
  } catch (error) {
    throw error;
  }
};

export type CableFormValues = z.infer<typeof cableSchema>;
// export type CableFormValues = z.infer<typeof cableSchema> & {
//   "cableRack[0]['terminationContainer']": number | null;
// };

//=============Config=================
export const hideFields = ["fibers", "cableRack"];

//der zweite Parameter sollte dann in der Liste hideFields stehen!
export const summarizeFields: Record<string, string | number> = {
  // strasse: "hausNr",
};

const localizedStrings: Record<string, Record<string, string>> = {
  de: {
    _class: "Kabelklase",
    comment: "Kommentar",
    length: "Länge",
    fiberCount: "Faseranzahl",
    cableNo: "Kabelnummer",
    type: "Kabeltyp",
  },
};

export function localizeCableKey(name: string, lang = "de"): string {
  if (name in localizedStrings[lang]) {
    return localizedStrings[lang]?.[name];
  }
  return name;
}
//========= Individual Cable Funticons =================

export function getCableName(data: Cable): string {
  let prefix = data._class === "OwnCable" ? "TXX" : "KUN";
  let cableNo = data.cableNo ? data.cableNo.toString().padStart(6, "0") : "";
  let suffix = data.type ? data.type.charAt(0).toUpperCase() : "";

  return prefix + cableNo + suffix;
}

//========= API Calls =================
const serverPath = process.env.NEXT_PUBLIC_API_URL;

//Get

/**
 * get Cables
 * Gibt alle Kabel zurück.
 * @param user
 * @returns
 */
export async function getCables(user: User) {
  let path = serverPath + "Cable";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * getCablesQuery
 * Gibt alle Kabel zurück.
 * @param user
 * @returns
 */
export function getCablesQuery(user: User) {
  return useQuery<Cables>({
    queryKey: ["cables"],
    queryFn: async () => {
      try {
        const data = await getCables(user);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export async function getOwnCables(user: User) {
  let path = serverPath + "OwnCable";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function getForeignLine(user: User) {
  let path = serverPath + "ForeignLine";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function getCable(user: User, id: number) {
  let path = serverPath + "Cable/" + id;
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
/**
 * getCable using react-query (caching)
 * The unique key you provide is used internally for refetching, caching, and sharing your queries throughout your application.
 * @param user
 * @param id
 * @param editForm Wenn true, wird das Lieferanten Objekt nich als Objekt zurückgegeben sondern nur dessen ID. Somit kann es bei Select Boxen auch vorausgewählt werden.
 * @returns
 */
export function getCableQuery(
  user: User,
  id: number,
  editForm: boolean = false
) {
  return useQuery<Cable>({
    queryKey: ["cables", id],
    queryFn: async () => {
      try {
        const data = await getCable(user, id);
        if (data.hasOwnProperty("lieferant") && editForm) {
          data.lieferant = await data.lieferant.id;
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  // react-query v3.0.0
  // return useQuery<Cable>(["cables", id], async () => {
  //   try {
  //     const data = await getCable(user, id);
  //     if (data.hasOwnProperty("lieferant") && editForm) {
  //       data.lieferant = await data.lieferant.id;
  //     }
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // });
}

export async function getFiber(user: User, id: number) {
  let path = serverPath + "Fiber/" + id;
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

//Patch
export async function editCable(user: User, cableData: Cable, id: number) {
  let path = serverPath + "Cable/" + id;
  try {
    const result = await apiPatchCall(user, path, cableData);
    return result;
  } catch (error) {
    throw error;
  }
}

//Post
export async function getFibers(user: User, cableData: Fiber[]) {
  let path = serverPath + "getFibers";
  try {
    const result = await apiPostCall(user, path, cableData);
    return result;
  } catch (error) {
    throw error;
  }
}
/**
 * Erstellt ein eigenes Kabel.
 * Optionale URL-Parameter:
 *
 * - fiberCount: Anzahl der zu generierenden Fasern. Default: 0
 * - firstFiber: erset Fasernummer der zu generierenden Fasern. Default: 1
 * /api/OwnCable?fiberCount=12&firstFiber=1
 * @todo add fiberCount / firstFiber
 * @example:
	"_class":"OwnCable",
	"type":"LWL",
	"comment":"unwichtiger Kommentar",
	"cableNo":1,
	"altName":"komischer alternativer Name",
	"length":100,
	"cableRack":[
		{"terminationContainer":20, "comment": "seltsames Kabelende"},
		{"terminationContainer":19}
		]
}
 * @param user
 * @param cableData
 * @returns
 */
export async function createCable(
  user: User,
  cableData: Cable,
  count: number,
  firstFiber: number = 1
) {
  let path =
    serverPath +
    "OwnCable" +
    "?fiberCount=" +
    count +
    "&firstFiber=" +
    firstFiber;
  try {
    const result = await apiPostCall(user, path, cableData);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Erstellt eine Fremdleitung.
 * Optionale URL-Parameter:
 *
 * - fiberCount: Anzahl der zu generierenden Fasern. Default: 0
 * / http://localhost:8080/api/ForeignLine?fiberCount=2
 * @todo add fiberCount
 * @example: {
	"_class":"ForeignLine",
	"comment":"Fremdleitung mit Standard-Faserenden ohne Fasernummern",
	"cableNo":5,
	"length":500,	
	"type":"LWL",
	"oldId":6,
	"lieferant":1,
	"cableRack":[{
		"terminationContainer": 3,
		"cableName":"ABC123",
		"comment":"unnützer Kommentar"
	},
	{
		"terminationContainer": 4,
		"cableName":"ABC456"
	}]
}
 * @param user
 * @param cableData
 * @returns
 */
export async function createForeignLine(
  user: User,
  cableData: Cable,
  count: number = 2
) {
  let path = serverPath + "ForeignLine" + "?fiberCount=" + count;
  try {
    const result = await apiPostCall(user, path, cableData);
    return result;
  } catch (error) {
    throw error;
  }
}
/**
 *
 * Erstellt eine neue Faser und ordnet diese dem angegebenen Kabel zu.
 * @example: Erzeugen eine Faser für ein eigenes Kabel und erstellt die Standard-Faserenden dazu:
 * {
	"_class":"OwnFiber",
	"cable":10,
	"fiberNo":99,
	"status":"FREI"
}
 * @example: Erzeugen einer eigenen Faser mit Beutzerdefinierten Faserenden: 
{
	"_class":"OwnFiber",
	"cable":10,
	"fiberNo":100,
	"status":"FREI",
	"terminations":[{
		"_class":"OwnFiberTermination",
		"type":"PATCH",
		"relatedCableRack":1,
		"terminationContainer": 20
	},
	{
		"_class":"OwnFiberTermination",
		"type":"SPLICE",
		"relatedCableRack":2,
		"terminationContainer": 19
	}]
}
* @example Erzeugen einer Benutzerdefinierte Faser einer Fremdleitung:
{
	"_class":"ForeignFiber",
	"cable":1,
	"status":"FREI",
	"terminations":[{
		"_class":"ForeignFiberTermination",
		"type":"PATCH",
		"relatedCableRack":1,
		"terminationContainer": 3,
		"fiberNo": 10

	},
	{
		"_class":"ForeignFiberTermination",
		"type":"SPLICE",
		"relatedCableRack":2,
		"terminationContainer": 4,
		"fiberNo": 11
	}]
}
 * @param user
 * @param cableData
 * @returns
 */
export async function addFiber(user: User, cableData: Cable) {
  let path = serverPath + "Fiber";
  try {
    const result = await apiPostCall(user, path, cableData);
    return result;
  } catch (error) {
    throw error;
  }
}

//PUT

//Delete
export async function deleteCable(user: User, id: number) {
  let path = serverPath + "Cable/" + id;
  try {
    const result = await apiDeleteCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function deleteFiber(user: User, id: number) {
  let path = serverPath + "Fiber/" + id;
  try {
    const result = await apiDeleteCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
