import { NavLink } from "react-router-dom";
import {
  buttonStyle,
  cardHeaderColorSecondary,
  cardStyleInner,
} from "../../components/Layout/tailwindStyles";
import { getLocationSymbols } from "../../model/Location";

import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import {
  faRectangleXmark,
  faSquareMinus,
  faSquarePlus,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";

export default function LocationChildren({
  location,
  isEditable,
  toggleIsEditable,
}: {
  location: any;
  isEditable: boolean;
  toggleIsEditable: () => void;
}) {
  const [expanded, setExpanded] = React.useState<string[]>(
    getIds(location, true)
  );
  const [selected, setSelected] = React.useState<string[]>([]);

  interface RenderTree {
    id: string | number;
    name: string;
    type?: string;
    children?: readonly RenderTree[];
  }

  const handleToggle = (_event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (_event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? getIds(location, true) : []
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0 ? getIds(location) : []
    );
  };

  /**
   * Generates an array of maybe all IDs from the given nested Objects or all IDs which have any children.
   *
   * @param {any[]} data - The data to traverse and extract the IDs from.
   * @param {boolean} onlyChildren - Flag indicating whether to only include IDs of nodes with children.
   * @returns {any[]} - An array of IDs extracted from the data.
   */
  function getIds(data: any[], onlyChildren = false) {
    const idArray: any[] = [];

    function traverse(node: { children: any[]; id: any }) {
      if (
        !onlyChildren ||
        (Array.isArray(node.children) && node.children.length > 0)
      ) {
        idArray.push(node.id.toString());
      }

      if (Array.isArray(node.children)) {
        node.children.forEach((child: any) => {
          traverse(child);
        });
      }
    }

    data.forEach((node) => {
      traverse(node);
    });

    return idArray;
  }

  /**
   * Styleing for the dashes before each item
   */
  const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      "& .close": {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  }));

  const renderTree = (nodes: RenderTree[] | undefined) => (
    <>
      {Array.isArray(nodes)
        ? nodes.map((node) => (
            // <TreeItem
            <StyledTreeItem
              key={node.id.toString()}
              nodeId={node.id.toString()}
              label={getNameAndSymbol(node)}
            >
              {Array.isArray(node.children)
                ? node.children.map((child) => (
                    <div key={child.id}>{renderTree([child])}</div>
                  ))
                : null}
            </StyledTreeItem>
          ))
        : null}
    </>
  );

  function getNameAndSymbol(object: any) {
    return (
      <>
        {getLocationSymbols(object.type)}
        <NavLink
          to={"/location/" + object.id}
          className={"text-emerald-600 font-bold hover:text-emerald-400"}
        >
          {" "}
          {object.name}
        </NavLink>
        <span className="text-sm">{" (" + object.type + ")"}</span>
      </>
    );
  }

  const layout = "p-3";
  const iconStyling = "block h-4 w-4 text-emerald-600";

  return (
    <>
      <div className={"text-left " + cardStyleInner}>
        <div
          className={`${layout} ${cardHeaderColorSecondary} pb-1 rounded-t-lg text-white`}
        >
          <h3 className={"text-base font-bold leading-7"}>
            enthaltene Objekte
          </h3>
          <p className="mt-1 text-sm leading-6 text-white-400">
            zugeordnete Objekte
          </p>
        </div>
        <div
          className={
            layout + " pt-2 border-t border-gray-200 dark:border-gray-600"
          }
        >
          <div className="mt-4">
            <Box sx={{ minHeight: 50, flexGrow: 1, maxWidth: 300 }}>
              <Box sx={{ mb: 1 }}>
                <Button onClick={handleExpandClick}>
                  <span className="text-emerald-600">
                    {expanded.length === 0 ? "Expand all" : "Collapse all"}
                  </span>
                </Button>
                <Button onClick={handleSelectClick}>
                  <span className="text-emerald-600">
                    {selected.length === 0 ? "Select all" : "Unselect all"}
                  </span>
                </Button>
              </Box>
              <TreeView
                aria-label="controlled"
                defaultCollapseIcon={
                  <FontAwesomeIcon
                    icon={faSquareMinus}
                    className={iconStyling}
                  />
                }
                defaultExpandIcon={
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    className={iconStyling}
                  />
                }
                defaultEndIcon={
                  <FontAwesomeIcon
                    icon={faRectangleXmark}
                    className={iconStyling + " opacity-50"}
                  />
                }
                expanded={expanded}
                selected={selected}
                onNodeToggle={handleToggle}
                onNodeSelect={handleSelect}
                multiSelect
              >
                {renderTree(location)}
              </TreeView>
            </Box>
            <button
              onClick={toggleIsEditable}
              className={`mt-4 ${buttonStyle}`}
            >
              {isEditable ? "stop editting" : "edit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
