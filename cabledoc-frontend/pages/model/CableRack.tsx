import { z } from "zod";
import { apiPatchCall } from "../../app/api/axios";
import { User } from "../../app/api/user";

//=============Shema=================

export type CableRack = {
  id?: number | null;
  terminationContainer?: number | null;
  cable?: number | null | {};
  comment?: string | null;
  cableName?: number | string | null;
  relatedTerminations?: number[] | null;
};

//=============ZOD=================
// export const numberSchema = z.preprocess((val) => {
//   if (val === "") {
//     return null;
//   }
//   return parseFloat(val as string);
// }, z.number().nullable());

export const CableRackSchema = z.object({
  id: z.number().nullable().optional(),
  // terminationContainer: numberSchema.nullable().optional(),
  terminationContainer: z
    .number({
      required_error: "terminationContainer is required",
      invalid_type_error: "Bitte eine Nummer größer als 0 eingeben",
    })
    .min(1),
  cable: z.number().nullable().optional(),
  comment: z.string().nullable().optional(),
  cableName: z.string().nullable().optional(),
  relatedTerminations: z.array(z.number()).nullable().optional(),
});

export type CableRackFormValues = z.infer<typeof CableRackSchema>;
export const cableRackArraySchema = z.array(CableRackSchema);

export type CableRacks = CableRack[];

//=============DefaultValue=================
export const defaultCableRackValues: CableRack = {
  terminationContainer: null,
  cable: null,
  comment: null,
  cableName: null,
};
//=============Config=================
export const hideFields = [""];

//der zweite Parameter sollte dann in der Liste hideFields stehen!
export const summarizeFields: Record<string, string | number> = {
  // strasse: "hausNr",
};

const localizedStrings: Record<string, Record<string, string>> = {
  de: {
    cableName: "Kabelname",
    terminationContainer: "Termination Container ID",
    comment: "Kommentar",
  },
};

export function localizeCableRackKey(name: string, lang = "de"): string {
  if (name in localizedStrings[lang]) {
    return localizedStrings[lang]?.[name];
  }
  return name;
}

//========= API Calls =================
const serverPath = process.env.NEXT_PUBLIC_API_URL;

//Get

//Patch
export async function editCableRack(user: User, data: CableRack, id: number) {
  let path = serverPath + "CableRack/" + id;
  try {
    const result = await apiPatchCall(user, path, data);
    return result;
  } catch (error) {
    throw error;
  }
}

//Post

//PUT
