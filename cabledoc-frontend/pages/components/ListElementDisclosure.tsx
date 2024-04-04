import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";

interface Data {
  name?: string;
  content?: string;
  id?: number | string;
}
interface ActionProps {
  data: Data;
  defaultOpen?: boolean;
  localizeFunction: (data: any) => string;
}

export default function ListElementDisclosure({
  data,
  localizeFunction,
  defaultOpen = false,
}: ActionProps) {
  function getName(object: any): string {
    if (object["name"] !== undefined) {
      return object["name"];
    }
    return "more Details";
  }

  function renderValue(value: any, depth: number = 0): JSX.Element {
    if (typeof value === "object" && value !== null) {
      return (
        <Disclosure defaultOpen={defaultOpen}>
          {({ open }) => (
            <>
              <Disclosure.Button className={"-m-2"}>
                {!open && getName(value)}
                <FontAwesomeIcon
                  icon={open ? faChevronUp : faChevronDown}
                  className={"px-2 h-4 w-4"}
                />
              </Disclosure.Button>
              <Disclosure.Panel>
                {Object.entries(value).map(([key, val]) => (
                  <div key={key} className={""}>
                    <span className={"font-bold"}>
                      {localizeFunction(key)}:{" "}
                    </span>
                    {renderValue(val, ++depth)}
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      );
    } else {
      return <span>{String(value)}</span>;
    }
  }

  return (
    <div className="text-sm font-medium leading-6 py-3 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0">
      <div className="text-sm font-bold leading-6">{data.name}</div>
      <div className="mt-1 text-sm leading-6 sm:col-span-3 sm:mt-0">
        {renderValue(data.content)}
      </div>
    </div>
  );
}
