import { z } from "zod";
import {
  apiDeleteCall,
  apiGetCall,
  apiPostCall,
  apiPutCall,
} from "../app/api/axios";
import { User } from "../app/api/user";

//=============Shema=================

export type Right = {
  name: string | null;
};
// Define the Zod schema for the User type
export const rightSchema = z.object({
  name: z.string().nullable().optional(),
  version: z.number().min(1).optional(),
});

export type RightFormValues = z.infer<typeof rightSchema>;

export type Rights = Right[];

//=============Config=================
export const hideFields = [""];

//der zweite Parameter sollte dann in der Liste hideFields stehen!
export const summarizeFields: Record<string, string | number> = {
  // strasse: "hausNr",
};

const localizedStrings: Record<string, Record<string, string>> = {
  de: {},
};

export function localizeRightKey(name: string, lang = "de"): string {
  if (name in localizedStrings[lang]) {
    return localizedStrings[lang]?.[name];
  }
  return name;
}

//========= API Calls =================
const serverPath = process.env.NEXT_PUBLIC_API_URL;

//Get
export async function getRight(user: User, name: string) {
  let path = serverPath + "Admin/Right/" + name;
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getRights(user: User) {
  let path = serverPath + "Admin/AllRights";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

//Post
export async function addRight(user: User, userData: User) {
  let path = serverPath + "Admin/Right";
  let result = await apiPostCall(user, path, userData);
  return result.data;
}
//PUT
export async function editRight(user: User, userData: User) {
  let path = serverPath + "Admin/Right";
  try {
    const result = await apiPutCall(user, path, userData);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function editRightRight(user: User, userData: User) {
  let path = serverPath + "Admin/RightRight";
  try {
    const result = await apiPutCall(user, path, userData);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function editUserRight(user: User, userData: User) {
  let path = serverPath + "Admin/UserRight";
  try {
    const result = await apiPutCall(user, path, userData);
    return result;
  } catch (error) {
    throw error;
  }
}

//Delete
export async function deleteRight(user: User, name: string) {
  let path = serverPath + "Admin/Right/" + name;
  try {
    const result = await apiDeleteCall(user, path);
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function deleteRightRight(
  user: User,
  parent: string,
  child: string
) {
  let path = serverPath + "Admin/RightRight/" + parent + "/" + child;
  try {
    const result = await apiDeleteCall(user, path);
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
}
export async function deleteUserRight(
  user: User,
  userData: string,
  right: string
) {
  let path = serverPath + "Admin/UserRight/" + userData + "/" + right;
  try {
    const result = await apiDeleteCall(user, path);
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
}
