// export type LocalizedStrings<U extends Record<string, string>> = {
//   de: U;
// };

export type LocalizedStrings<
  T extends string,
  U extends Record<string, string>
> = {
  [key in T]: U;
};
