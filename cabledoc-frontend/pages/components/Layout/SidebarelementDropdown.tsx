import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "@headlessui/react";

export default function SidebarelementDropdown({
  obj,
}: {
  obj: any;
  isSidebarOpen: boolean;
  itemKey: number;
}) {
  const iconStylingSmall = "block h-3 w-3 text-emerald-600";
  const sidebarHoverStyling = "hover:bg-gray-100 dark:hover:bg-gray-600";

  return (
    <>
      <Menu.Items className="w-60 origin-top-right absolute start-16 top-12  divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="px-2 py-2">
          <span className="text-emerald-800 font-bold px-2">{obj.label}</span>
        </div>

        <div className="px-1 py-1 ">
          {obj.children.map(function (child: any, i: number) {
            return (
              <Menu.Item key={i}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-emerald-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm  ${sidebarHoverStyling}`}
                  >
                    {active ? (
                      <FontAwesomeIcon
                        className={`mr-2 h-5 w-5 ${iconStylingSmall}`}
                        aria-hidden="true"
                        icon={child.icon}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className={`mr-2 h-5 w-5 ${iconStylingSmall}`}
                        aria-hidden="true"
                        icon={child.icon}
                      />
                    )}
                    <span className="break-keep">{child.label}</span>
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </div>
      </Menu.Items>
    </>
  );
}
