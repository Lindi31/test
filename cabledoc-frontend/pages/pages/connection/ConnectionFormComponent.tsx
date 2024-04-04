import { zodResolver } from "@hookform/resolvers/zod";
import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import AutoCompleteBox from "../../components/AutoCompleteBox";
import InputForm from "../../components/InputForm";
import { labelLayoutBig } from "../../components/Layout/tailwindStyles";
import SelectForm from "../../components/SelectForm";
import { ShowValidationErrors } from "../../components/ShowValidationErrors";
import {
  ConnectionFormProps,
  ConnectionFormValues,
  connectionSchema,
  connectionStatus,
  fiberCounts,
} from "../../model/Connection";
import { cableTypes } from "../../model/Cable";

export default function ConnectionFormComponent({
  setError,
  onSubmit,
  defaultValues,
  optionLists,
  isSubmitting,
  isEditForm = false,
}: ConnectionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConnectionFormValues>({
    defaultValues,
    resolver: zodResolver(connectionSchema),
  });

  const [inputObject, setInputObject] = useState(defaultValues);

  if (isSubmitting) {
    return <p>Loading...</p>;
  }

  interface DataItem {
    id: number;
    name: string;
  }
  const handleAutocompleteChange = (
    _event: ChangeEvent<{}>,
    newValue: DataItem | null,
    id: any
  ) => {
    if (newValue) {
      const updatedInputObject = { ...inputObject }; // Create a shallow copy of the state object

      if (id.toString() === "start_search") {
        setValue(`start`, parseInt(String(newValue.id)));
        updatedInputObject.start = parseInt(String(newValue.id));
      } else {
        setValue(`end`, parseInt(String(newValue.id)));
        updatedInputObject.end = parseInt(String(newValue.id));
      }
      setInputObject(updatedInputObject);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (setError) setError("test");

    const { name, value } = e.target;
    const [field, index, keyName] = name.split(".");

    // For Handling array objects
    const fieldArray = inputObject[field as keyof ConnectionFormValues];
    // console.log(fieldArray, field, index, keyName, name, value);
    if (
      Array.isArray(fieldArray) &&
      inputObject &&
      field &&
      name.includes(".")
    ) {
      setInputObject((prevData) => ({
        ...prevData,
        [field as keyof ConnectionFormValues]: [
          ...fieldArray.slice(0, Number(index)),
          {
            ...((fieldArray[Number(index)] as any) || {}), // Use type assertion to treat it as an object
            [keyName]: value,
          },
          ...fieldArray.slice(Number(index) + 1),
        ],
      }));
    } else {
      setInputObject((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const indexTerminationA = optionLists.terminationContainerList.findIndex(
    (x) => x.id === String(inputObject.start)
  );
  const autaCompleteValueA = optionLists.terminationContainerList[
    indexTerminationA
  ]?.name
    ? optionLists.terminationContainerList[indexTerminationA]?.name
    : "bitte wählen";
  const indexTerminationB = optionLists.terminationContainerList.findIndex(
    (x) => x.id === String(inputObject.end)
  );
  const autoCompleteValueB = optionLists.terminationContainerList[
    indexTerminationB
  ]?.name
    ? optionLists.terminationContainerList[indexTerminationB]?.name
    : "bitte wählen";

  const columnLayout = "flex flex-wrap -mx-3 mb-5";
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/*  <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, e))}> */}
      {errors && Object.keys(errors).length !== 0 && (
        <ShowValidationErrors errors={errors as any} />
      )}
      {/* =====Faseranzahl // Type ==== */}
      <div className={columnLayout}>
        <div className="w-full md:w-1/2 px-3">
          <SelectForm
            data={{
              name: "Faseranzahl",
              modelName: "fiberCount",
              required: true,
              options: fiberCounts,
              value: inputObject?.fiberCount as number,
              disabled: isEditForm,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <>
            <SelectForm
              data={{
                name: "Typ",
                modelName: "type",
                options: cableTypes,
                value: inputObject?.type as string,
                // default: connectionStatus[3],
                isNumber: false,
              }}
              register={register}
              errors={errors}
              handleChange={handleChange}
            />
          </>
        </div>
      </div>
      {/* =====status / Comment ==== */}
      <div className={columnLayout}>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <SelectForm
            data={{
              name: "Status",
              modelName: "status",
              options: connectionStatus,
              value: inputObject?.status as string,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <InputForm
            data={{
              name: "Kommentar",
              modelName: "comment",
              type: "textarea",
              value: inputObject.comment as string,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
      </div>
      {/* =====Länge  ==== */}
      {/* <div className={columnLayout}>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <InputForm
            data={{
              name: "Länge",
              modelName: "length",
              value: inputObject.length,
              isNumber: true,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/2 px-3"></div>
      </div> */}
      {/* =====Termination Container A / Termination Container B ==== */}
      <div className={columnLayout + " "}>
        {/* ====ROW1===== */}
        <div
          className={`${labelLayoutBig} w-full md:w-1/2 px-3 mb-2 border-r-2`}
        >
          Startpunkt
        </div>
        <div className={`${labelLayoutBig} w-full md:w-1/2 px-3 mb-2`}>
          Endpunkt
        </div>
        {/* ====ROW2===== */}
        <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
          <InputForm
            data={{
              name: "id (oder)",
              modelName: `start` as const,
              value: inputObject?.start as number,
              required: true,
              isNumber: true,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
        <div className="w-full md:w-2/6 px-3 mb-6 md:mb-0 border-r-2">
          <AutoCompleteBox
            data={optionLists.terminationContainerList}
            name="Suche"
            modelName="start_search"
            handleChange={handleAutocompleteChange}
            value={autaCompleteValueA}
          />
        </div>
        <div className="w-full md:w-1/6 px-3">
          <InputForm
            data={{
              name: "id (oder)",
              modelName: `end` as const,
              value: inputObject.end as number,
              required: true,
              isNumber: true,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
        <div className="w-full md:w-2/6 px-3">
          <AutoCompleteBox
            data={optionLists.terminationContainerList}
            name="Suche"
            modelName="end_search"
            handleChange={handleAutocompleteChange}
            value={autoCompleteValueB}
          />
        </div>
      </div>
      <button
        type="submit"
        id="FormSubmitButton"
        className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
      >
        Send
      </button>
    </form>
  );
}
