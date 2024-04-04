import { ActionBarElement } from "../types/actionBar";
import { LocalizedStrings } from "../types/localize";

/**
 * prüft ob das übergebene Array ein Datums Array ist.
 * Ein Datum wird von der API als Array mit 7 Werten zurückgegeben.
 * @param arr Array
 * @returns
 */
export function isDate(arr: number[]) {
  return arr[0] >= 1950 && arr[0] <= 3000 && arr.length === 7;
}

/**
 * Formartiert das Datums Array
 * @param arr
 * @returns
 */
export function formatDate(dateArray: any[]) {
  if (Array.isArray(dateArray)) {
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5],
      dateArray[6]
    );
    return date.toLocaleString();
  }
  return dateArray;
}

// interface Node<TKey, TValue> {
//   [key in TKey]: TValue;
//   children: Node<TKey, TValue>[];
// }

// type GenericType = Node<string, any>;

// export type TreeNode2<
//   TKey extends string | number,
//   TValue,
//   TChildren extends TreeNode2<TKey, TValue, TChildren>[] = []
// > = {
//   [key in TKey]: TValue;
//   // children: TChildren;
//   // children: TreeNode<TKey, TValue>[];
// };

export interface TreeNode {
  id: number;
  parentId: number | null;
  name: string;
  type?: string;
  children: TreeNode[];
}

/**
 * loop recursivley throug objects
 * @param array
 * @param parentId
 * @returns
 */
let transformTree = (array: any[], parentId: number | null): any[] => {
  let filtered = array.filter((obj) => obj.parentId === parentId);
  let mapped = filtered.map((obj) => ({
    ...obj,
    children: transformTree(array, obj.id),
  }));
  return mapped;
};

/**
 ** Formats an Tree of Objects
 * see formatData
 * @param data
 * @returns
 */
export async function createTree(data: any) {
  let result = transformTree(data, null);
  return result[0];
}

export function unFlattenWithParentIds(data: any[]): any[] {
  const resultMap: Record<number, any> = {};
  const resultArr: any[] = [];

  // Create a mapping of objects by their ID
  for (const item of data) {
    resultMap[item.id] = { ...item, children: [] };
  }

  // Traverse the data and build the result array
  for (const item of data) {
    if (item.parentId !== undefined) {
      if (resultMap[item.parentId]) {
        resultMap[item.parentId].children.push(resultMap[item.id]);
      } else {
        resultArr.push(resultMap[item.id]);
      }
    } else {
      resultArr.push(resultMap[item.id]);
    }
  }

  return resultArr;
}

/**
 * @todo refactor this!!!!! loop for infinity
 * @param obj
 * @param hideFields
 * @param summarizeFields
 * @param localizedStrings
 * @returns
 */
export function formatDataTree(
  obj: any,
  hideFields: string[],
  summarizeFields: Record<string, string | number>,
  localizedStrings: LocalizedStrings<"de", Record<string, string>>
): any {
  let formatObj = formatData(
    obj,
    hideFields,
    summarizeFields,
    localizedStrings
  );

  if (formatObj.children.length === 0) {
    return [];
  }
  for (let child of formatObj.children) {
    let modifiedChild = formatData(
      child,
      hideFields,
      summarizeFields,
      localizedStrings
    );

    formatObj.children.push(modifiedChild);
  }
  return formatObj;
}

/**
 * filter the object by id with all nested objects
 * Example
 * {
            "id": 13,
            "version": 0,
            "name": "Kundenkäfig",
            "comment": "",
            "parentId": 12,
            "children": [
                {
                    "id": 14,
                    "version": 0,
                    "name": "TopSecret",
                    "comment": "",
                    "parentId": 13,
                    "children": [],
                }
            ],
        },
 * @param obj 
 * @param id 
 * @returns 
 */
export async function findObjectById(obj: any, id: number): Promise<any> {
  if (obj.id.toString() === id.toString()) {
    return obj;
  }
  if (obj.children && obj.children.length > 0) {
    for (let child of obj.children) {
      let result = findObjectById(child, id);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
}

/**
 * see findObjectById
 * @param obj
 * @param id
 * @returns
 */
export function findObjectByIdNotAsync(obj: any, id: number): any {
  console.log(obj, id);

  if (obj.id.toString() === id.toString()) {
    return obj;
  }
  if (obj.children && obj.children.length > 0) {
    for (let child of obj.children) {
      let result = findObjectByIdNotAsync(child, id);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
}

export function processArray(array: any[], targetId: number): any | null {
  for (const obj of array) {
    console.log(obj);

    const foundObject = findObjectByIdNotAsync(obj, targetId);
    if (foundObject) {
      return foundObject;
    }
  }
  return null;
}

/**
 * Format an Array of Objects
 * see formatData
 * @param data
 * @param hideFields
 * @param summarizeFields
 * @param localizedStrings
 * @returns
 */
export async function formatDataArray(
  data: any,
  hideFields: string[],
  summarizeFields: Record<string, string | number>,
  localizedStrings: LocalizedStrings<"de", Record<string, string>>
): Promise<any[]> {
  let formatted = [];
  for (const dat of data) {
    const typedNewObj = formatData(
      dat,
      hideFields,
      summarizeFields,
      localizedStrings
    );
    formatted.push(typedNewObj);
  }
  return formatted;
}

/**
 * converts an object
 * 1. hides empty|null|undifened fields
 * 2. it summarizes property for ex. Street + Building No
 * 3. it localizes the the property name
 * @todo: Single Responsibility Principle
 * @param data
 * @param hideFields
 * @param summarizeFields
 * @param localizedStrings
 * @returns
 */
export function formatData(
  data: { [s: string]: string | number },
  hideFields: string[],
  summarizeFields: Record<string, string | number>,
  localizedStrings: LocalizedStrings<"de", Record<string, string>>
) {
  const newObj: any = {};
  for (const [key, value] of Object.entries(data)) {
    // console.log(`${key}: ${value}`);

    if (key === "parentId") {
      newObj[key] = value;
      continue;
    }
    //hide values defined in hideFeields and Null Values
    if (hideFields.includes(key) || value === null || value === undefined) {
      continue;
    }
    newObj[key] = value;

    //Summarize
    if (key in summarizeFields) {
      const summarizeKey = summarizeFields[key];
      const summarizedValue = data[summarizeKey];
      newObj[key] = `${value} ${summarizedValue}`;
      hideFields.push(String(summarizeFields[key]));
    }

    //isDate?
    if (Array.isArray(value) && isDate(value)) {
      newObj[key] = formatDate(value);
    }
  }
  return localizeNames(newObj, localizedStrings);
}

/**
 */
export function localizeNames(
  data: { [s: string]: string | number },
  localizedStrings: LocalizedStrings<"de", Record<string, string>>
) {
  const newObj: any = {};
  for (const [key, value] of Object.entries(data)) {
    newObj[localize(key, localizedStrings)] = value;
  }
  return newObj;
}

export function localize<T extends string, U extends Record<string, string>>(
  name: keyof U,
  localizedStrings: LocalizedStrings<T, U>,
  lang: T = "de" as T
): string {
  if (name in localizedStrings[lang]) {
    return localizedStrings[lang]?.[name];
  }
  return String(name);
}

/**
 * Converts an input object into a new object where each property value is an array of names extracted from the input object's properties.
 * Example: converts this...
 * {
    "Standort": [
        {
            "name": "POP",
            "displayName": "POP"
        },
        {
            "name": "HVT",
            "displayName": "HVT"
        },
        {
            "name": "TXX",
            "displayName": "TXX"
        },
        ...
* into this:
* {
    "Standort": [
        "POP",
        "HVT",
        "TXX",
        "END",
        "SCHACHT",
        "IPC",
        "KVZ"
    ],
 * @param {Record<string, any>} inputObject - The input object to be converted.
 * @return {Record<string, string[]>} - The converted object where each property value is an array of names extracted from the input object's properties.
 */
export function convertObject(
  inputObject: Record<string, any>
): Record<string, string[]> {
  const convertedObject: Record<string, string[]> = {};

  for (const key in inputObject) {
    if (Object.prototype.hasOwnProperty.call(inputObject, key)) {
      const items = inputObject[key].map(
        (item: Record<string, any>) => item.name
      );
      convertedObject[key] = items;
    }
  }
  return convertedObject;
}

export function removeEmptyValues(data: any) {
  // Remove properties with undefined or null values
  for (const key in data) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      delete data[key];
    }
  }
  return data;
}

/**
 * Retrieves the name after the last dot in a given input string.
 *
 * @param {string} input - The input string.
 * @return {string | null} The name after the dot, or null if no dot is found.
 */
export function getNameAfterDot(input: string): string | null {
  const dotIndex = input.lastIndexOf(".");
  if (dotIndex !== -1 && dotIndex < input.length - 1) {
    return input.substring(dotIndex + 1);
  }
  return null;
}

interface MessageItem {
  result: any;
  messages: string[];
  error: string[];
}
export function mergeMessages(messagesArray: MessageItem[]): string {
  return messagesArray.map((item) => item.messages.join("\n")).join("\n");
}

export interface NestedObject {
  id: number;
  version: number;
  name: string;
  Kommentar: string;
  parentId?: number;
  children?: NestedObject[];
  type: string;
}

/**
 * This code defines a flattenObject function that recursively flattens the nested objects. It then iterates over your initial array of objects and flattens each one, collecting all the flattened objects into the flattenedObjects array.
 *  fter running this code, flattenedObjects will contain all the objects in a single-level array.
 * @param obj
 * @returns
 */
export function flattenObjectArray(arr: NestedObject[]): NestedObject[] {
  let flattened: NestedObject[] = [];

  for (const obj of arr) {
    flattened.push(obj);

    if (obj.children && obj.children.length > 0) {
      const flattenedChildren = flattenObjectArray(obj.children);
      flattened = flattened.concat(flattenedChildren);
    }
  }
  return flattened;
}

/**
 * Filters the array and only show the changed ids
 * @param firstArray
 * @param secondArray
 * @returns
 */
export function getChangedIds(firstArray: any[], secondArray: any[]) {
  const firstArrayMap = new Map<number, any>();
  firstArray.forEach((item) => {
    firstArrayMap.set(item.id, item);
  });

  // Filter the second array to find objects with changed parentId
  const changedIds = secondArray.filter((item) => {
    const originalItem = firstArrayMap.get(item.id);
    return originalItem && originalItem.parentId !== item.parentId;
  });
  return changedIds;
}

export function isError(result: any): result is { type: string; error: any } {
  return result.error !== undefined;
}

export function isSuccess(result: any): result is { type: string; data: any } {
  return result.data !== undefined;
}

export function filterActionBarElements(
  elements: ActionBarElement[],
  params: { [x: string]: any; hasOwnProperty: (arg0: string) => any }
): ActionBarElement[] {
  return elements.filter((element) => {
    const isIdNaN = isNaN(params.id);
    return !isIdNaN || !element.specific;
  });
}

export function replacePathPlaceholders(
  elements: any[],
  params: { [x: string]: any; hasOwnProperty: (arg0: string) => any }
) {
  const filteredActionBarElements = filterActionBarElements(elements, params);

  return filteredActionBarElements.map((element) => {
    let newPath = element.path;

    // Replace placeholders with values from the params object
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        newPath = newPath.replace(`:${key}`, params[key]);
      }
    }

    return { ...element, path: newPath };
  });
}
