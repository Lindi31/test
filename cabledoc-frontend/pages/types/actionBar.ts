import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type ActionBarElement = {
  label: string;
  path: string;
  specific?: boolean; //if specific is true, it will only be schonw for specific location ids
  icon: IconDefinition | null;
};
