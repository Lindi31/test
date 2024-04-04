import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "@headlessui/react";
import SidebarelementDropdown from "./SidebarelementDropdown";
import Link from "next/link";

export default function Sidebarelement({
  obj,
  isSidebarOpen,
  itemKey,
}: {
  obj: any;
  isSidebarOpen: boolean;
  itemKey: number;
}) {
  const sidebarStyling =
    "flex items-center p-2 pl-4 mt-1 rounded-lg w-full group";

  const iconStyling = "block h-5 w-5 text-emerald-600";
  const iconStylingSmall = "block h-4 w-4 text-emerald-600";

  // const borderStyling =
  //   "hover:border dark:hover:border hover:border-emerald-200 dark:hover:border-emerald-600";
  const sidebarHoverStyling = "hover:bg-gray-100 dark:hover:bg-gray-600";

  return (
    <div key={itemKey}>
      {obj.children.length === 0 ? (
        <Link
          href={obj.path}
          className={sidebarStyling + " " + sidebarHoverStyling}
        >
          <FontAwesomeIcon
            icon={obj.icon}
            className={iconStyling}
            aria-hidden="true"
          />
          <span className={"ml-3 " + (isSidebarOpen ? "inline" : "hidden")}>
            {obj.label}
          </span>
        </Link>
      ) : (
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button
                type="button"
                className={
                  sidebarStyling +
                  " " +
                  sidebarHoverStyling +
                  (open ? " bg-emerald-800 text-white" : "")
                }
                aria-controls={"dropdown-" + obj.label}
              >
                <FontAwesomeIcon
                  icon={obj.icon}
                  className={iconStyling}
                  aria-hidden="true"
                />
                <span
                  className={
                    "flex-1 ml-3 text-left whitespace-nowrap " +
                    (isSidebarOpen ? "inline" : "hidden")
                  }
                  sidebar-toggle-item=""
                >
                  {obj.label}
                </span>

                <FontAwesomeIcon
                  icon={open ? faChevronUp : faChevronDown}
                  className={iconStylingSmall + " ml-2"}
                />
              </Menu.Button>
              <Menu.Items>
                {isSidebarOpen ? (
                  <Menu.Item>
                    {
                      // @ts-ignore
                      ({ active }) => (
                        <div
                          className={
                            "py-1 px-2 font-small text-sm bg-emerald-50 text-gray-600"
                          }
                        >
                          {obj.children.map(function (child: any, i: number) {
                            return (
                              <Sidebarelement
                                key={i}
                                obj={child}
                                isSidebarOpen={isSidebarOpen}
                                itemKey={i + 1000}
                              />
                            );
                          })}
                        </div>
                      )
                    }
                  </Menu.Item>
                ) : (
                  <SidebarelementDropdown
                    obj={obj}
                    isSidebarOpen={isSidebarOpen}
                    itemKey={itemKey}
                  />
                )}
              </Menu.Items>
            </>
          )}
        </Menu>
      )}
    </div>
  );
}
