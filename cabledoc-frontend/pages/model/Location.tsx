import { faker } from "@faker-js/faker";
import { z } from "zod";
import {
  convertObject,
  createTree,
  formatData,
  formatDataArray,
  isError,
  isSuccess,
} from "../ressources/functions";
import {
  AxiosReturnType,
  apiDeleteCall,
  apiGetCall,
  apiPostCall,
  apiPutCall,
} from "../../app/api/axios";
import {
  IconDefinition,
  faBars,
  faBox,
  faBoxArchive,
  faBuildingFlag,
  faBuildingShield,
  faBuildingUser,
  faCube,
  faGripVertical,
  faInbox,
  faSolarPanel,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

import {
  faBuilding,
  faCircle,
  faSquare,
  faSquareFull,
} from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "../../app/api/user";
import { useQuery } from "@tanstack/react-query";

export type Locateable = {
  Klasse?: any;
  location_type?: number;
  id?: number | "";
  comment?: string | null;
  createdAt?: Date | null;
  lastModifiedAt?: Date | null;
  name: string | null;
  parentId?: number | null;
  version?: number | null;
  createdBy?: number | null;
  lastModifiedBy?: number | null | Date;
  children?: number[] | null;
  plz?: string | null;
  ort?: string | null;
  strasse?: string | null;
  hausNr?: string | null;
  type?: string | null;
  lat?: number | null;
  lon?: number | null;
  className?: string | null;
};

export type ChildType = {
  name: string;
  comment: string;
  className: string;
  type: string;
};

export const emptyLocation: Locateable = {
  comment: null,
  createdAt: null,
  lastModifiedAt: null,
  name: null,
  parentId: null,
  version: null,
  createdBy: null,
  lastModifiedBy: null,
  children: null,
  plz: null,
  ort: null,
  strasse: null,
  hausNr: null,
  type: null,
  lat: null,
  lon: null,
  className: null,
};

export const numberSchema = z.preprocess((val) => {
  if (val === "") {
    return null;
  }
  return parseFloat(val as string);
}, z.number().nullable());

//Zod schema
const childSchema = z.object({
  name: z.string().min(2).optional(),
  comment: z.string().nullable().optional(),
  className: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  parentId: numberSchema.nullable().optional(),
});

export const locationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  location_type: z.number().optional(),
  comment: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  lastModifiedAt: z.date().nullable().optional(),
  parentId: numberSchema.nullable().optional(),
  version: z.number().nullable().optional(),
  createdBy: z.number().nullable().optional(),
  lastModifiedBy: z.number().nullable().optional(),
  // children: z.array(z.number()).nullable().optional(),
  plz: z.string().nullable().optional(),
  ort: z.string().nullable().optional(),
  strasse: z.string().nullable().optional(),
  hausNr: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  children: z.array(childSchema).optional(),
  // children: z.union([
  //   z.array(childSchema).optional(),
  //   z.array(z.number()).nullable().optional(),
  // ]),
  // children: z.array(z.string()).optional(),
  //Var1
  // lat: z.string()
  // .transform((val) => (val.trim() === "" ? "" : parseFloat(val)))
  // .refine((val) => !Number.isNaN(val), "Invalid number")
  // .optional()
  // .nullable(),
  //Var2
  // lat: z.preprocess(
  //   (val) => parseFloat(z.string().transform(commaToPeriod).parse(val)),
  //   z.union([z.nan(), z.number()]).optional().nullable()
  // ),
  lat: numberSchema.nullable().optional(),
  lon: numberSchema.nullable().optional(),
  // test: numberSchema,
  className: z.string().nullable().optional(),
});

export type FormValues = z.infer<typeof locationSchema>;

export type Locations = Locateable[];

export type LocationTypes = {
  Standort?: string[] | any[];
  SubStandort: string[] | any[];
  TerminationContainer: string[] | any[];
};

export const hideFields = ["topContainer", "accessibilityList"];

//der zweite Parameter sollte dann in der Liste hideFields stehen!
export const summarizeFields: Record<string, string | number> = {
  strasse: "hausNr",
};

export const localizedStrings = {
  de: {
    comment: "Kommentar",
    createdAt: "erstellt am",
    lastModifiedAt: "geändert am",
    name: "name",
    // parentId: "eltern ID",
    version: "version",
    createdBy: "erstellt von",
    lastModifiedBy: "geändert von",
    // children: "kinder",
    plz: "plz",
    strasse: "strasse",
    hausNr: "haus Nr.",
    type: "type",
    lat: "lat",
    lon: "lon",
    className: "Klasse",
  },
};

//========= Individual Location Funticons =================

export async function filterTerminationContainerList(
  list: Record<string, string[]>
): Promise<{ name: string; id: string }[]> {
  const filteredTerminationContainerList = Object.entries(list)
    .map(([key, values]) => ({
      name: values.join(" ") + " (ID: " + String(key) + ")",
      id: key,
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  return filteredTerminationContainerList;
}

export type SubmitResult = {
  result: Locateable | null;
  messages: string[];
  error: any;
};

interface Location {
  name: string;
  plz: string;
  ort: string;
  strasse: string;
}

interface LocationChildren {
  name: string | any;
  type: string | any;
}

/**
 * * @example
 * transforms an nested Object
 * {
    "id": 4,
    "version": 0,
    "name": "FirmaXY",
    "parentId": null,
    "children": [
        {
            "id": 5,
            "version": 0,
            "name": "Raum xy",
            "Kommentar": "erster Substandort",
            "parentId": 4,
            "children": [
                {
                    "id": 10,
                    "version": 0,
                    "name": "Schrank 4711",
                    "Kommentar": "erster TerminationContainer",
                    "parentId": 5,
                    "children": [],
                    "type": "RackBack",
                    "Klasse": "TerminationContainer"
                }
            ],
            "type": "RAUM",
            "Klasse": "SubStandort"
        }
    ],
    "plz": "76133",
    "ort": "Karlsruhe",
    "strasse": "Amalienbadstr 41",
    "type": "POP",
    "lat": 8.5890711,
    "lon": 49.1287007,
    "Klasse": "Standort"

} 
# into this object:{
    "location": {
        "name": "FirmaXY",
        "plz": "76133",
        "ort": "Karlsruhe",
        "strasse": "Amalienbadstr 41"
    },
    "children": [
        {
            "name": "Raum xy",
            "tpye": "RAUM"
        },
        {
            "name": "Schrank 4711",
            "tpye": "RackBack"
        }
    ]
}
 * @param input 
 * @returns 
 */
function extractAddressFromTree(input: any): {
  location: Location;
  children: LocationChildren[];
} {
  const location: Location = {
    name: input.name,
    plz: input.plz,
    ort: input.ort,
    strasse: input.strasse,
  };

  const children: LocationChildren[] = input.children.map((child: any) => {
    return { name: child.name, type: child.type, id: child.id };
  });

  input.children.forEach((child: any) => {
    children.push(...extractAddressFromTree(child).children);
  });

  return { location, children };
}

export type LocateableAddress = {
  location: Location;
  children: LocationChildren[];
};

/**
 * transforms a Locateable into an readable Address
 * @param user
 * @param locatableId
 * @returns
 */
export async function getLocationAddress(
  user: User,
  locatableId: number
): Promise<LocateableAddress> {
  let response = await getFullLocation(user, locatableId);
  let transformed = extractAddressFromTree(response);
  return transformed;
}

function getParentId(result: SubmitResult[]) {
  let parentId: number | null = null;
  if (result.length > 0) {
    const lastResult = result[result.length - 1];
    const id = lastResult?.result?.id;

    if (id !== undefined) {
      parentId = parseInt(id as string);
    }
  }
  return parentId;
}

export async function handleSubmitCreateLocation(
  user: User,
  data: Locateable
): Promise<SubmitResult[]> {
  let result: SubmitResult[] = [];

  let children = data.children;
  delete data["children"];

  result.push((await addLocation(user, data)) as SubmitResult);
  if (children && children?.length > 0) {
    for (let i = 0; i < children.length; i++) {
      let parentId = getParentId(result);
      console.log(parentId);

      let child = children[i] as unknown as ChildType;
      result.push((await addLocation(user, child, parentId)) as SubmitResult);
    }
  }

  return result;
}

async function addLocation(
  user: User,
  data: Locateable,
  parentId: number | null = null
): Promise<SubmitResult | undefined> {
  if (!("parentId" in data) && parentId) {
    data.parentId = parentId;
  }
  let result: SubmitResult = {
    result: null,
    messages: [],
    error: [],
  };

  try {
    let location = await createLocation(user, data);
    if (location) {
      result.result = location;
      result.messages.push(
        `${location.type} successfully transferred to Backend! ID: ${location.id}`
      );
    } else {
      result.messages.push(
        "There was an error while transferring the form data" + location.id
      );
    }
  } catch (error) {
    let errorMessage = "";
    if ((error as any)?.response) {
      errorMessage +=
        (error as any).response.status +
        " : " +
        (error as any).response.data.message;
    }
    result.messages.push(
      `An error occurred during Validation. Please try again later.\n${errorMessage}`
    );
    console.log("Error", error);
    result.error.push(error);
  }
  return result;
}

export async function editMultipleLocations(
  user: User,
  locateables: Locateable[]
) {
  let endResult: AxiosReturnType = { type: "success", data: [] };

  for (const locateable of locateables) {
    const outputObject = {
      id: locateable.id,
      parentId: locateable.parentId,
      className: locateable.Klasse,
    };

    const result = await editLocateable(user, outputObject as Locateable);

    if (isError(result)) {
      console.error(`Error editing locateable: ${locateable.id}`, result.error);
      endResult.data.push({
        id: locateable.id,
        error: result.error,
      });
    } else if (isSuccess(result)) {
      endResult.data.push(locateable.id);
    }
  }

  if (endResult.data.some((item: any) => "error" in item)) {
    endResult.type = "error";
  }

  return endResult;
}

export function filterByClassName(data: any[], className: any) {
  return data.filter(
    (item: { className: any }) => item.className === className
  );
}

//========= API Calls =================

// const serverPath = "http://localhost:8080/api/";
const serverPath = process.env.NEXT_PUBLIC_API_URL;

//GET

/**
 * Retrieves the location types for a given user.
 * used for the dropdwon menus in addLocation or editLocation
 *
 * @param {User} user - The user object.
 * @return {Promise<LocationTypes>} A promise that resolves to the location types.
 */
export async function getLocationTypes(user: User): Promise<LocationTypes> {
  let path = serverPath + "Standort/AllTypes";
  try {
    const standortTypes = await apiGetCall(user, path);
    path = serverPath + "SubStandort/AllTypes";
    let subStandortTypes = await apiGetCall(user, path);
    path = serverPath + "TerminationContainer/AllTypes";
    let terminationContainerTypes = await apiGetCall(user, path);
    const location_types: LocationTypes = {
      Standort: standortTypes,
      SubStandort: subStandortTypes,
      TerminationContainer: terminationContainerTypes,
    };

    let convertedObject = convertObject(location_types) as LocationTypes;

    return convertedObject;
  } catch (error) {
    throw error;
  }
}

export async function getLocation(
  user: User,
  id: number,
  format: boolean = true
) {
  let path = serverPath + "Locateable/" + id;
  try {
    const result = await apiGetCall(user, path);
    if (!format) {
      return result;
    }
    const typedNewObj: Locateable = formatData(
      result,
      hideFields,
      summarizeFields,
      localizedStrings
    );
    return typedNewObj;
  } catch (error) {
    throw error;
  }
  // let result = await apiGetCall(user, path);
  // let apiResult = result.data;
  // if (!format) {
  //   return apiResult;
  // }
  // const typedNewObj: Locateable = formatData(
  //   apiResult,
  //   hideFields,
  //   summarizeFields,
  //   localizedStrings
  // );
  // return typedNewObj;
}

export async function getFullLocation(user: User, id: number) {
  let path = serverPath + "LocateableTree/" + id;
  try {
    const result = await apiGetCall(user, path);
    let formated = await formatDataArray(
      result,
      hideFields,
      summarizeFields,
      localizedStrings
    );

    let tree = await createTree(formated);

    return tree;
  } catch (error) {
    throw error;
  }
}
export async function getStandorte(user: User) {
  let path = serverPath + "Standort";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * getStandorteQuery
 * Gibt alle Standorte zurück.
 * @param user
 * @returns
 */
export function getStandorteQuery(user: User) {
  return useQuery<Locations>({
    queryKey: ["standorte"],
    queryFn: async () => {
      try {
        const data = await getStandorte(user);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
}
export async function getLocations(user: User) {
  let path = serverPath + "AllLocateables";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * getLocationsQuery
 * Gibt alle Standorte zurück.
 * @param user
 * @returns
 */
export function getLocationsQuery(user: User) {
  return useQuery<Locateable>({
    queryKey: ["locations"],
    queryFn: async () => {
      try {
        const data = await getLocations(user);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export async function getTerminationContainerList(user: User) {
  let path = serverPath + "TerminationContainerList";
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

export function getTerminationContainerListQuery(user: User) {
  return useQuery<{ name: string; id: string }[], Error>({
    queryKey: ["terminationContainer"],
    queryFn: async () => {
      try {
        const data = await getTerminationContainerList(user);
        const filteredTerminationContainerList =
          await filterTerminationContainerList(data);
        return filteredTerminationContainerList;
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  // react-query v3.0.0
  // return useQuery<{ name: string; id: string }[], Error>(
  //   ["terminationContainer"],
  //   async () => {
  //     try {
  //       const data = await getTerminationContainerList(user);
  //       const filteredTerminationContainerList =
  //         await filterTerminationContainerList(data);
  //       return filteredTerminationContainerList;
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
  // );
}

/**
 * 
 * @param user Gibt eine Liste der Ortsnamen in der Datenbank aus, die zu {name} maximal eine Levenshtein-Ditanz von maxDistance aufweisen. ist {name} breist in der Datenbank enthalten, ist dieser mit in der Ausgabe enthalten. Der Vergleich erfolgt Case-insensitive.

Optionaler URL-Parameter: maxDistance={int} (Default: 3). Gibt die maximale Levenshtein-Distanz an, bis zu der eine Ähnlichkeit angenommen wird.
 * @param place 
 * @param maxDistance 
 * @returns 
 */
export async function getSimilarity(
  user: User,
  place: string,
  maxDistance: number = 3
) {
  let path =
    serverPath + "Similarity/Orts/" + place + "?maxDistance=" + maxDistance;
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * 
 * @param user 
Gibt eine Liste der Straßennamen im Ort {ort} in der Datenbank aus, die zu {name} maximal eine Levenshtein-Ditanz von maxDistance aufweisen. Ist {name} breist in der Datenbank enthalten, ist dieser mit in der Ausgabe enthalten. Der Vergleich von {name} erfolgt Case-Insensitive. Der Vergelich von {ort} erfolgt Case-Sensitive.  
Falls {name} mit "str" oder "str." endet, wird für den Vergleich diese Zeichenfolge zu "straße" umgewandelt.

Optionaler URL-Parameter: maxDistance={int} (Default: 3). Gibt die maximale Levenshtein-Distanz an, bis zu der eine Ähnlichkeit angenommen wird.
 * @param place 
 * @param street 
 * @param maxDistance 
 * @returns 
 */
export async function getSimilarityStreet(
  user: User,
  place: string,
  street: string,
  maxDistance: number = 3
) {
  let path =
    serverPath +
    "Similarity/Orts/" +
    place +
    "/" +
    street +
    "?maxDistance=" +
    maxDistance;
  try {
    const result = await apiGetCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}
//POST
export async function getSpecificLocations(user: User, locatableIds: number[]) {
  let path = serverPath + "Locateable/getList";
  try {
    const result = await apiPostCall(user, path, locatableIds);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function createLocation(user: User, locateable: Locateable) {
  let path = serverPath + "Locateable";
  try {
    const result = await apiPostCall(user, path, locateable);
    return result;
  } catch (error) {
    throw error;
  }
}

//DELETE
export async function deleteLocateable(user: User, id: number) {
  let path = serverPath + "Locateable/" + id;
  try {
    const result = await apiDeleteCall(user, path);
    return result;
  } catch (error) {
    throw error;
  }
}

//PUT
export async function editLocateable(user: User, locateable: Locateable) {
  let path = serverPath + "Locateable";
  try {
    const result = await apiPutCall(user, path, locateable);
    return result;
  } catch (error) {
    throw error;
  }
}

//========= Symbols =================

const symbols: { [key: string]: IconDefinition } = {
  POP: faBuilding,
  HVT: faBuildingFlag,
  TXX: faBuildingShield,
  END: faBuildingUser,
  SCHACHT: faSquare,
  IPC: faBuildingShield,
  KVZ: faBoxArchive,
  GEBAUEDE: faBuilding,
  STOCKWERK: faStore,
  RAUM: faCube,
  KAEFIG: faGripVertical,
  Muffe: faInbox,
  PatchMuffe: faInbox,
  DoubleRack: faBox,
  RackFront: faSquare,
  RackBack: faSquareFull,
  SingleRack: faBars,
  Patchfeld: faSolarPanel,
  SONSTIGES: faCircle,
};

/**
 * @param name
 * @returns
 */
export function getLocationSymbols(name: string | null | "") {
  let styleLogo = "h-4 w-4";
  if (name === null || name === "" || !symbols.hasOwnProperty(name)) {
    return <FontAwesomeIcon icon={faCircle} className={styleLogo} />;
  }
  return <FontAwesomeIcon icon={symbols[name]} className={styleLogo} />;
}

//========= FAKE Locations =================
export async function getFakeLocations() {
  let locations: Locateable[] = faker.helpers.multiple(createRandomLocation, {
    count: 100,
  });
  // Add a delay of 1000 ms (1 second)
  await new Promise((resolve) => setTimeout(resolve, 500));
  return locations;
  // let users = await axios.get(serverPath);
}

export function getFakeLocation(id: number) {
  return createRandomLocation(id);
}

export function getFakeLocationNotASync() {
  let locations: Locateable[] = faker.helpers.multiple(createRandomLocation, {
    count: 50,
  });
  return locations;
}

export function createRandomLocation(id: null | number = null): Locateable {
  // const fakedId = id ? id : faker.number.int();
  const fakedId = id
    ? faker.helpers.rangeToNumber({ min: id, max: id })
    : faker.helpers.rangeToNumber({ min: 1, max: 5000 });
  return {
    // id: faker.string.uuid(),
    location_type: faker.helpers.rangeToNumber({ min: 1, max: 3 }),
    id: fakedId,
    comment: faker.lorem.sentence({ min: 3, max: 5 }),
    createdAt: faker.date.past(),
    lastModifiedAt: faker.date.past(),
    name: faker.company.name(),
    parentId: faker.helpers.rangeToNumber({ min: 1, max: 5000 }),
    version: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
    createdBy: faker.number.int(10000),
    lastModifiedBy: faker.number.int(10000),
    children: [faker.helpers.rangeToNumber({ min: 1, max: 10 })],
    plz: faker.location.zipCode(),
    strasse: faker.location.street(),
    hausNr: faker.location.buildingNumber(),
    type: faker.helpers.arrayElement([
      "POP",
      "HVT",
      "TXX",
      "END",
      "SCHACHT",
      "IPC",
      "KVZ",
    ]),
    lat: faker.location.latitude(),
    lon: faker.location.longitude(),
    className: faker.helpers.arrayElement([
      "Standort",
      "SubStandort",
      "TerminationContainer",
    ]),
  };
}
//========= FAKE Locations =================
