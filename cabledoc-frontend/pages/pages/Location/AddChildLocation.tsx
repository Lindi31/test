import { useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";

import { ChildType, FormValues, LocationTypes } from "../../model/Location";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getNameAfterDot } from "../../ressources/functions";

type AddChildLocationProps = {
  index: number;
  types: LocationTypes;
  childValues: ChildType[];
  setChildValues: React.Dispatch<React.SetStateAction<ChildType[]>>;
  handleCheckbox: any;
  register: UseFormRegister<FormValues>;
  errors: any;
};

// Define a form component that uses the custom hook
export default function AddChildLocation({
  index,
  types,
  childValues,
  setChildValues,
  handleCheckbox,
  register,
  errors,
}: AddChildLocationProps) {
  // const [selectedOption, setSelectedOption] = useState("SubStandort");
  const [newTypes, setNewTypes] = useState({ ...types });

  useEffect(() => {
    const { Standort, ...newData } = newTypes;
    setNewTypes(newData);
  }, []);

  let options: string[] | undefined =
    newTypes[childValues[index]["className"] as keyof LocationTypes];

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const newValues = [...childValues];
    const nameAfterDot = getNameAfterDot(name);
    if (!newValues[index]) {
      newValues[index] = {} as ChildType;
    }

    const key = nameAfterDot as keyof ChildType;
    if (nameAfterDot !== null) {
      newValues[index][key] = value;
      setChildValues(newValues);
    }
  };

  const labelLayout =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";
  const inputLayout =
    "appearance-none block rounded w-full py-2 px-4 bg-gray-200 text-gray-700 border border-gray-200 focus:border-gray-500 leading-tight focus:outline-none focus:bg-white";
  const selectLaypout =
    "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

  const columnLayout = "flex flex-wrap -mx-3 mb-5";
  const errorFieldLayout = "text-red-500 text-sm";

  const inputName = `children[${index}].name` as "name";
  const inputClassName = `children[${index}].className` as "className";
  const inputType = `children[${index}].type` as "type";
  const inputComment = `children[${index}].comment` as "comment";

  return (
    <>
      <div className="border-t-2 mt-2 pt-4 pl-6">
        {/* =====NAME / TYPE==== */}
        <div className={columnLayout}>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className={labelLayout} htmlFor="grid-name">
              Name
            </label>
            <input
              {...register(inputName)}
              className={inputLayout + " mb-3"}
              id={`grid-name-${index}`}
              type="text"
              placeholder=""
              onChange={handleChange}
            />
            {errors.name && (
              <span className={errorFieldLayout}>{errors.name.message}</span>
            )}
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className={labelLayout} htmlFor="grid-class">
              Klasse
            </label>
            <div className="relative">
              <select
                {...register(inputClassName)}
                className={selectLaypout}
                id={`grid-class-${index}`}
                value={childValues[index].className}
                onChange={handleChange}
              >
                {Object.keys(newTypes).map((key) => {
                  return (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FontAwesomeIcon icon={faCaretDown} className="ml-4" />
              </div>
            </div>
            {errors.className?.message && (
              <span className={errorFieldLayout}>
                {errors.className.message}
              </span>
            )}
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className={labelLayout} htmlFor="grid-type">
              Standorttyp
            </label>
            <div className="relative">
              <select
                {...register(inputType)}
                className={selectLaypout}
                id={`grid-type-${index}`}
                value={childValues[index].type}
                onChange={handleChange}
              >
                {options &&
                  options.map((type, index) => (
                    <option key={index} value={index}>
                      {type}
                    </option>
                  ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FontAwesomeIcon icon={faCaretDown} className="ml-4" />
              </div>
            </div>
            {errors.type?.message && (
              <span className={errorFieldLayout}>{errors.type.message}</span>
            )}
          </div>
        </div>
        {/* =====COMMENT==== */}
        <div className={columnLayout}>
          <div className="w-full md:w-1/2 px-3">
            <label htmlFor="comment" className={labelLayout}>
              Kommentar
            </label>
            <textarea
              {...register(inputComment)}
              className={inputLayout + " mb-3"}
              id={`grid-comment-${index}`}
              rows={3}
              placeholder="Your Comment"
              onChange={handleChange}
            ></textarea>
            {errors.comment && (
              <span className={errorFieldLayout}>{errors.comment.message}</span>
            )}
          </div>
        </div>
        <div>
          {/* ======== chekcbox ========== */}
          <div className={columnLayout}>
            <div className="w-full px-3 mb-6 md:mb-0">
              <input
                type="checkbox"
                id="checkbox"
                className="rounded border focus:outline-none focus:border-emerald-500 mr-2"
                onClick={handleCheckbox}
              />
              <label htmlFor="checkbox" className="text-sm font-bold">
                weiteres Unterobjekt hinzufügen{" "}
                <span className={"font-normal"}>
                  (Stockwerk, Raum, Schrank,...)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
