import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  editMultipleLocations,
  getLocationSymbols,
} from "../../model/Location";
import { NavLink, useOutletContext } from "react-router-dom";
import {
  buttonStyle,
  cardStyleInner,
} from "../../components/Layout/tailwindStyles";
import {
  NestedObject,
  flattenObjectArray,
  getChangedIds,
  unFlattenWithParentIds,
} from "../../ressources/functions";
import { User } from "../../../app/api/user";
import { axiosErrorHandler } from "../../../app/api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function LocationChildren({
  location,
  id,
  isEditable,
  toggleIsEditable,
}: {
  location: any;
  id: number;
  isEditable: boolean;
  toggleIsEditable: () => void;
}) {
  const [list, setList] = useState(JSON.parse(JSON.stringify(location))); //Deep Copy of location

  const user: User = useOutletContext();

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newLocation = [...list];
    const flattenedObjects: NestedObject[] = flattenObjectArray(newLocation);
    const destination = result.destination.droppableId.replace(/\D/g, "");
    const source = result.draggableId.replace(/\D/g, "");

    flattenedObjects.map((object) => {
      if (object.id.toString() === source.toString()) {
        object.parentId = parseInt(destination);
        /**
         *@todo write to backend
         */
      }
    });
    const unflattenedData = unFlattenWithParentIds(flattenedObjects);
    setList(unflattenedData);
  };

  const getUlClassNames = (isDraggingOver: any): string => {
    let classNames = "list-none list-inside p-2 pb-0 mb-0 ";
    if (isEditable) {
      classNames += " border border-emerald-500 ";
    }
    if (isDraggingOver) {
      classNames += "bg-emerald-200 ";
    } else {
      // classNames += "bg-yellow-200 ";
    }
    return classNames;
  };

  const getLiClassNames = (isDragging: any): string => {
    let classNames = "p-1 pb-1 ";
    if (isEditable) {
      classNames += " border border-yellow-500 ";
    }
    if (isDragging) {
      classNames += " bg-emerald-500 ";
    } else {
      // classNames += " bg-blue-500 ";
    }
    return classNames;
  };

  const renderList = (objects: any[], parent: any) => {
    return (
      <Droppable droppableId={"Drop" + parent} isDropDisabled={!isEditable}>
        {(provided, snapshot) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            // style={getListStyle(snapshot.isDraggingOver)}
            className={getUlClassNames(snapshot.isDraggingOver)}
          >
            {objects.map((object: any, index: number) => {
              return (
                <Draggable
                  key={object.id.toString()}
                  draggableId={"Drag" + object.id.toString()}
                  index={index}
                  isDragDisabled={!isEditable}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // style={getItemStyle(
                      //   snapshot.isDragging,
                      //   provided.draggableProps.style
                      // )}
                      className={getLiClassNames(snapshot.isDragging)}
                    >
                      {getLocationSymbols(object.type)}{" "}
                      <NavLink
                        to={"/location/" + object.id}
                        className={
                          "text-emerald-600 font-bold hover:text-emerald-400"
                        }
                      >
                        {object.name}
                      </NavLink>
                      {" (" + object.type + " ID:" + object.id + ")"}
                      {object.children.length > 0 &&
                        renderList(object.children, object.id.toString())}
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  };
  const layout = "p-3";

  const saveNewList = async () => {
    console.log("TODO: Write Save Function for Backend");

    const flattenedObjectsOld: NestedObject[] = flattenObjectArray(location);
    const flattenedObjectsNew: NestedObject[] = flattenObjectArray(list);

    let changedIds = getChangedIds(flattenedObjectsOld, flattenedObjectsNew);

    let results = await editMultipleLocations(user, changedIds);
    if (results.type === "success") {
      toast.success(
        "Folgende IDS wurden erfolgreich berabeitet: " + results.data.join("\n")
      );
    } else {
      let message = axiosErrorHandler(results.data[0].error);
      toast.error("Fehler bei der Änderung: " + message);
    }
  };

  return (
    <>
      <div className={"text-left " + cardStyleInner}>
        <div className={layout + " pb-0"}>
          <h3 className={"text-base font-bold leading-7"}>
            enthaltene Objekte
          </h3>
          <p
            className="mt-1
         text-sm leading-6 text-gray-400"
          >
            zugeordnete Objekte
          </p>
        </div>
        <div
          className={
            layout + " mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"
          }
        >
          <div className="mt-4">
            <DragDropContext onDragEnd={onDragEnd}>
              {/* {renderList(list, id.toString())} */}
              {renderList(list, "root" + id.toString())}
            </DragDropContext>
          </div>
          <button onClick={toggleIsEditable} className={`mt-4 ${buttonStyle}`}>
            {isEditable ? "stop editting" : "edit"}
          </button>
          {isEditable && (
            <button
              onClick={saveNewList}
              className={`ml-2 mt-4 ${buttonStyle}`}
            >
              Save
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          gutter={24}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
    </>
  );
}
