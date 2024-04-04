import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export default interface Menu {
  label: string;
  path: string;
  icon: IconDefinition;
  children: [Menu];
}
