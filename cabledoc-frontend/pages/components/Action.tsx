import {
  IconDefinition,
  faEye,
  faPenToSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface Data {
  name?: string;
  id?: number | string;
}

interface ActionProps {
  data: Data;
  actionName: string;
  name?: string;
  symbolName?: string;
  size?: number;
  handleFunction?: (data: Data) => void;
}

type IconSize = {
  [key: number]: string;
};

const iconSize: IconSize = {
  1: "h-1 w-1",
  2: "h-2 w-2 ",
  3: "h-3 w-3 ",
  4: "h-4 w-4",
  5: "h-5 w-5 ",
  6: "h-6 w-6 ",
};

type SymbolType = {
  [key: string]: IconDefinition;
};

const symbolName: SymbolType = {
  view: faEye,
  edit: faPenToSquare,
  delete: faTrashAlt,
};

export default function Action({
  data,
  actionName,
  name = "",
  symbolName: defaultSymbolName = "view",
  size = 4,
  handleFunction,
}: ActionProps) {
  const symbol = symbolName[defaultSymbolName];

  if (typeof handleFunction === "function") {
    return (
      <button
        className="text-emerald-600 font-bold hover:text-emerald-400"
        onClick={() => handleFunction(data)}
      >
        <FontAwesomeIcon icon={symbol} className={iconSize[size]} />
        {name}
      </button>
    );
  }

  return (
    <Link href={`/${actionName}/${String(data.id)}`}>
      <div className="text-emerald-600 font-bold hover:text-emerald-400">
        <FontAwesomeIcon icon={symbol} className={iconSize[size]} />
        {name}
      </div>
    </Link>
  );
}
