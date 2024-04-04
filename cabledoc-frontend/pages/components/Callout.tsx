import {
  faCheck,
  faFire,
  faInfo,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

interface Props {
  type: "info" | "warning" | "error" | "success";
  heading?: boolean;
}
const defaultProps = {
  type: "info",
  heading: false,
};

export default function Callout({
  data,
  children,
  className,
}: {
  data: Props;
  children: ReactNode;
  className?: string;
}) {
  const mergedData = {
    ...defaultProps, // Default values
    ...data, // Provided props override defaults
  };

  const typeMapping = {
    success: {
      styling: "text-stone-600 border-green-300 bg-green-100",
      headName: "Success",
      icon: <FontAwesomeIcon icon={faCheck} className="" />,
    },
    info: {
      styling: "text-stone-600 border-cyan-400 bg-blue-100",
      headName: "Info",
      icon: <FontAwesomeIcon icon={faInfo} className="" />,
    },
    warning: {
      styling: "text-stone-600 border-amber-300 bg-amber-100",
      headName: "Warnung",
      icon: <FontAwesomeIcon icon={faWarning} className="" />,
    },
    error: {
      styling: "text-stone-600 border-red-300 bg-red-100",
      headName: "Achtung",
      icon: <FontAwesomeIcon icon={faFire} className="" />,
    },
  };

  return (
    <div
      className={`my-2 p-2 mr-2 ${className} ${
        typeMapping[mergedData.type].styling
      } rounded border-l-8`}
    >
      {mergedData.heading ? (
        <>
          <div className="text-xl font-bold leading-7 mb-2">
            <span className="px-1">{typeMapping[mergedData.type].icon} </span>
            <span className="">{typeMapping[mergedData.type].headName}</span>
          </div>
          {children}
        </>
      ) : (
        children
      )}
    </div>
  );
}
