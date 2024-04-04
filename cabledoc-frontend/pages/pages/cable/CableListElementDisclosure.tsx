import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { getLocationSymbols } from "../../model/Location";
import { NavLink } from "react-router-dom";

interface Data {
  name?: string;
  content?: {
    name: string;
    type: string;
  }[];
  id?: number | string;
}
interface ActionProps {
  data: Data;
  defaultOpen?: boolean;
  localizeFunction: (data: any) => string;
}

export default function CableListElementDisclosure({
  data,
  localizeFunction,
  defaultOpen = false,
}: ActionProps) {
  function getNameAndSymbol(object: any) {
    return (
      <>
        {getLocationSymbols(object.type)}
        <NavLink
          to={"/location/" + object.id}
          className={"text-emerald-600 font-bold hover:text-emerald-400"}
        >
          {" "}
          {localizeFunction(object.name)}
        </NavLink>
        <span className="text-sm">{" (" + object.type + ")"}</span>
      </>
    );
  }

  return (
    <div className="text-sm font-medium leading-6 py-3 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0">
      <div className="text-sm font-bold leading-6">{data.name}</div>
      <div className="mt-1 text-sm leading-6 sm:col-span-3 sm:mt-0">
        <Disclosure defaultOpen={defaultOpen}>
          {({ open }) => (
            <>
              <Disclosure.Button className={""}>
                <FontAwesomeIcon
                  icon={open ? faChevronUp : faChevronDown}
                  className={"px-2 h-4 w-4"}
                />
              </Disclosure.Button>
              <Disclosure.Panel>
                {data.content ? (
                  data.content.map((item, index) => (
                    <div
                      key={index}
                      className={"mt-1 text-sm leading-6 sm:col-span-3 sm:mt-0"}
                    >
                      <span className="">
                        {"- "}
                        {getNameAndSymbol(item)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div>No content available</div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
