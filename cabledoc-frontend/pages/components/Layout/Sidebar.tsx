import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { NavbarConfig } from "../../types/navbar";
import { getHeight, getWidth } from "./getClassNames";
import { Disclosure } from "@headlessui/react";
import menu from "./sidebarMenu";
import Sidebarelement from "./Sidebarelement";

export default function Sidebar({
  isSidebarOpen,
  navProperties,
}: {
  isSidebarOpen: boolean;
  navProperties: NavbarConfig;
}) {
  /**
   * MM
   * tailwind extracts only class names as complete unbroken strings so this should be done in some variants
   * so we use this funktions getHeight()...
   * see https://tailwindcss.com/docs/content-configuration#dynamic-class-names
   * @example https://azouaoui-med.github.io/react-pro-sidebar/iframe.html?id=playground--playground&args=&viewMode=story
   */

  return (
    <>
      <Disclosure>
        <aside
          className={`fixed ${getWidth(
            navProperties,
            isSidebarOpen,
            "w"
          )} left-0 h-full transition-all ${getHeight(
            Number(navProperties.navbar.height),
            "h"
          )}]
        }`}
          id="sidebar"
          aria-label="Sidebar"
        >
          <div className="my-5 flex-grow">
            {menu.map(function (object, i) {
              return (
                <div className="pr-3">
                  <Sidebarelement
                    obj={object}
                    isSidebarOpen={isSidebarOpen}
                    itemKey={i}
                    key={i}
                  />
                </div>
              );
            })}
          </div>
          <div className="border-t mt-16 ">
            <Sidebarelement
              obj={{
                label: "Logout",
                path: "/logout",
                icon: faSignOut,
                children: [],
              }}
              isSidebarOpen={isSidebarOpen}
              itemKey={99}
              key={99}
            />
          </div>
        </aside>
      </Disclosure>
    </>
  );
}
