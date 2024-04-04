import { z } from "zod";
import {
  apiDeleteCall,
  apiGetCall,
  apiPostCall,
  apiPutCall,
} from "../app/api/axios";
import { User } from "../app/api/user";
import { useQuery } from "@tanstack/react-query";

//=============Shema=================

export type Lieferant = {
  id?: number | null;
  name?: string | null;
  shortName?: string | null;
  phone?: string | null;
  fax?: string | null;
  eMail?: string | null;
  comment?: string | null;
};

//=============ZOD=================
export const numberSchema = z.preprocess((val) => {
  if (val === "") {
    return null;
  }
  return parseFloat(val as string);
}, z.number().nullable());

// Define the Zod schema for the User type
export const LieferantSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().nullable().optional(),
  shortName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  fax: z.string().nullable().optional(),
  eMail: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
});

export type LieferantFormValues = z.infer<typeof LieferantSchema>;

export type Lieferanten = Lieferant[];

//=============Config=================
export const hideFields = [""];

//der zweite Parameter sollte dann in der Liste hideFields stehen!
export const summarizeFields: Record<string, string | number> = {
  // strasse: "hausNr",
};

const localizedStrings: Record<string, Record<string, string>> = {
  de: {},
};

export function localizeLieferantenKey(name: string, lang = "de"): string {
  if (name in localizedStrings[lang]) {
    return localizedStrings[lang]?.[name];
  }
  return name;
}

//========= API Calls =================
const serverPath = process.env.NEXT_PUBLIC_API_URL;

//Get
export async function getLieferant(user: User, id: number) {
  let path = serverPath + "Lieferant/" + id;
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function getLieferanten(user: User) {
  let path = serverPath + "Lieferant";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
export function getLieferantenQuery(user: User) {
  return useQuery<Lieferant>({
    queryKey: ["lieferanten"],
    queryFn: async () => {
      try {
        const data = await getLieferanten(user);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  // react-query v3.0.0
  // try {
  //   return useQuery<Lieferant>(["lieferanten"], async () => {
  //     const data = await getLieferanten(user);
  //     return data;
  //   });
  // } catch (error) {
  //   throw error;
  // }
}

//Patch

//Post
export async function addLieferant(user: User, data: Lieferant) {
  let path = serverPath + "Lieferant";
  try {
    const result = await apiPostCall(user, path, data);
    return result;
  } catch (error) {
    throw error;
  }
}

//PUT
export async function editLieferant(user: User, data: Lieferant) {
  let path = serverPath + "Lieferant";
  try {
    const result = await apiPutCall(user, path, data);
    return result;
  } catch (error) {
    throw error;
  }
}

//Delete
export async function deleteLieferant(user: User, id: number) {
  let path = serverPath + "Lieferant/" + id;
  try {
    const result = await apiDeleteCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
