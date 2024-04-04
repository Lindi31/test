import { z } from "zod";
import {
  apiDeleteCall,
  apiGetCall,
  apiPostCall,
  apiPutCall,
} from "../../app/api/axios";
import { User } from "../../app/api/user";

//=============Shema=================
// export type see under stor/user.ts

// Define the Zod schema for the User type
export const userSchema = z.object({
  id: z.number().min(1).optional(),
  active: z.boolean().optional(),
  department: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  initials: z.string().max(5).nullable().optional(),
  localPassword: z.string().nullable().optional(),
  mail: z.string().nullable().optional(),
  mobilePhone: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  version: z.number().min(1).optional(),
});

export type USerFormValues = z.infer<typeof userSchema>;

export type Users = User[];

//=============Config=================
export const hideFields = ["allRights", ""];

//der zweite Parameter sollte dann in der Liste hideFields stehen!
export const summarizeFields: Record<string, string | number> = {
  // strasse: "hausNr",
};

const localizedStrings: Record<string, Record<string, string>> = {
  de: {
    department: "Abteilung",
    phone: "Durchwahl",
    initials: "Initialen",
  },
};

export function localizeUserKey(name: string, lang = "de"): string {
  if (name in localizedStrings[lang]) {
    return localizedStrings[lang]?.[name];
  }
  return name;
}

//========= API Calls =================
//========= API Calls =================
const serverPath = process.env.NEXT_PUBLIC_API_URL;

//Get
export async function getLoggedInUser(user: User) {
  let path = serverPath + "User/loggedInUser";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function getUser(user: User, id: number) {
  let path = serverPath + "User/" + id;
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getUsers(user: User) {
  let path = serverPath + "User";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

//Post
export async function addUser(user: User, userData: User) {
  let path = serverPath + "Admin/User";
  try {
    const result = await apiPostCall(user, path, userData);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function setUserPassword(user: User, userData: User, id: number) {
  let path = serverPath + "Admin/SetUserPassword/" + id;
  try {
    const result = await apiPostCall(user, path, userData);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function setPassword(user: User, userData: User) {
  let path = serverPath + "Admin/SetPassword";
  try {
    const result = await apiPostCall(user, path, userData);
    return result;
  } catch (error) {
    throw error;
  }
}
//PUT
export async function editUser(user: User, userData: User) {
  let path = serverPath + "Admin/User";
  try {
    const result = await apiPutCall(user, path, userData);
    return result;
  } catch (error) {
    throw error;
  }
}

//Delete
/**
 * Löscht den User mit angegebener ID.
 * Nicht möglich, falls der Nutzer bereits als Fremdschlüssel in anderen Einträgen verwendet wird.
 * @param user
 * @param id
 * @returns
 * - 404 Falls Nutzer nicht gefunden
 * - 500 z.B. wenn der Nutzer bereits als Fremdschlüssel verwendet wird
 */
export async function deleteUser(user: User, id: number) {
  let path = serverPath + "Admin/User/" + id;
  try {
    const result = await apiDeleteCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
