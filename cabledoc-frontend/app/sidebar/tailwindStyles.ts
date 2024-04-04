// tailwindstyles.ts
export const buttonStyle: string =
  "px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none";

export const buttonStyleNoPadding: string =
  "bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none";

export const cardStyleOuter: string = "w-fit h-fit";

export const cardStyleInner: string =
  "border rounded-lg shadow border-separate border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-600";

export const headerStyle: string =
  "mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white";

export const labelLayout: string =
  "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";
export const labelLayoutBig: string =
  "block tracking-wide text-emerald-600 text-base font-bold mb-2";

export const inputLayout: string =
  "appearance-none block rounded w-full py-2 px-4 bg-gray-200 text-gray-700 border border-gray-200 focus:border-gray-500 leading-tight focus:outline-none focus:bg-white";
export const selectLaypout: string =
  "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
export const errorFieldLayout: string = "text-red-500 text-sm";

export const selectLayout: string =
  "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
export const theadStyle: string =
  "bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 uppercase dark:text-gray-400";
export const theadStyleBlue: string =
  "bg-blue-100 dark:bg-gray-700 text-xs text-gray-700 uppercase dark:text-gray-400";

export const tfootStyle: string = theadStyle;
export const tableLayout: string =
  "px-2 py border-l border-slate-200 dark:border-gray-700";
export const tableStyle: string =
  "bg-white border-b dark:bg-gray-900 dark:border-gray-700";

export const opacity: string = "opacity-80";

//Custom Color see tailwind.config.js
// export const cardHeaderColorPrimary = "bg-emerald-600";
export const cardHeaderColorPrimary: string = "bg-primary-green";
// export const cardHeaderColorSecondary = "bg-sky-700";
export const cardHeaderColorSecondary: string = "bg-secondary-blue";
// export const cardHeaderThird = "bg-rose-taupe";
export const cardHeaderThird: string = "bg-third-red";
export function applyTheme(theme: string): string {
  // Fügen Sie hier die Logik zur Anwendung des Themas hinzu
  // Rückgabe einer Zeichenfolge, die eine Klasse darstellt
  return theme === "dark" ? "darkClass" : "lightClass";
}
