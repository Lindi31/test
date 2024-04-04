import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "@headlessui/react";

export default function NavbarElement({
  obj,
  itemKey,
}: {
  obj: any;
  itemKey: number;
}) {
  return (
    <>
      <div key={itemKey}>
        <a href="/notifications" className="flex items-center ml-4">
          <FontAwesomeIcon icon={obj.icon} className="mr-2" />
          <span>{obj.label}</span>
        </a>
      </div>
    </>
  );
}
