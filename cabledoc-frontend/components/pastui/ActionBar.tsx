import { Menu } from "@headlessui/react";
import { faIcons } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionBarElement } from "../../util/types/actionBar";
import { buttonStyleNoPadding } from "../../app/sidebar/tailwindStyles";
import React from "react";
import Link from "next/link";

export type SettingsActionBar = {
  showText?: boolean;
  showIcon?: boolean;
  showMoreButtonGreaterThen?: number;
};

export default function ActionBar({
  actionList,
  highlight = "",
  settings = {},
}: {
  actionList: ActionBarElement[];
  highlight?: string;
  settings?: SettingsActionBar;
}) {
  const mergedSettings: SettingsActionBar = {
    showText: true,
    showIcon: true,
    showMoreButtonGreaterThen: 5,
    ...settings,
  };

  return (
    <div className="flex justify-start space-x-1 mb-4">
      {actionList.map((props, i) => {
        return (
          <React.Fragment key={i}>
            {i <= (mergedSettings.showMoreButtonGreaterThen as number) - 1 ? (
              props.label !== "divide" ? (
                <IconButton
                  key={i}
                  properties={props}
                  highlight={props.label === highlight}
                  settings={mergedSettings}
                />
              ) : (
                <div className="border-r-2 border-gray-200" key={i} />
              )
            ) : (
              i === (mergedSettings.showMoreButtonGreaterThen as number) && ( // Render the "More" button only once when i is 3
                <Menu>
                  <Menu.Button className={`${buttonStyleNoPadding} px-4`}>
                    More...
                  </Menu.Button>

                  <Menu.Items className="rounded-md max-h-7 z-50">
                    <div className="px-1 py-1 ">
                      {actionList
                        .slice(
                          mergedSettings.showMoreButtonGreaterThen as number
                        )
                        .map((props, j) => (
                          <Menu.Item key={j} as="div">
                            {({ active }) => (
                              <IconButton
                                key={i + j + 1} // Make sure keys are unique
                                properties={props}
                                highlight={active}
                                settings={mergedSettings}
                              />
                            )}
                          </Menu.Item>
                        ))}
                    </div>
                  </Menu.Items>
                </Menu>
              )
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function IconButton({
  properties,
  highlight = false,
  settings = { showText: true, showIcon: true },
}: {
  properties: ActionBarElement;
  highlight?: boolean;
  settings?: SettingsActionBar;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center px-2 py-1 border border-gray-300 rounded-md text-sm font-medium ${
        highlight
          ? " bg-orange-200 font-extrabold	"
          : " text-gray-700 bg-gray-50 "
      }`}
    >
      <Link href={properties.path} className={""}>
        {settings.showIcon && (
          <FontAwesomeIcon icon={properties.icon || faIcons} />
        )}
        {settings.showText && (
          <span className={"ml-3 "}>{properties.label}</span>
        )}
      </Link>
    </button>
  );
}
