import { ReactNode } from "react";
import {
  cardStyleInner,
  cardHeaderColorPrimary,
} from "./Layout/tailwindStyles";

interface Props {
  name: string;
  nameColor?: string;
  subname?: string;
  subnameColor?: string;
  color?: string;
}
export default function Card({
  data,
  children,
}: {
  data: Props;
  children: ReactNode;
}) {
  //Defaul Values
  const subname = data.subname || "";
  const color = data.color || cardHeaderColorPrimary;
  const nameColor = data.nameColor || "text-white-200";
  const subnameColor = data.subnameColor || "text-white-400";
  const layout = "pl-3 pt-3";

  return (
    <div className={"text-left " + cardStyleInner}>
      <div className={`${layout} ${color} pb-1 rounded-t-lg text-white`}>
        <h3 className={`text-base font-bold leading-7 ${nameColor}`}>
          {data.name}
        </h3>
        <p className={`mt-1 text-sm leading-6 ${subnameColor}`}>{subname}</p>
      </div>
      <div
        className={layout + " border-t border-gray-200 dark:border-gray-600"}
      >
        {children}
      </div>
    </div>
  );
}
