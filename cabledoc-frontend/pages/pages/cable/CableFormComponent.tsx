import { zodResolver } from "@hookform/resolvers/zod";
import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import AutoCompleteBox from "../../components/AutoCompleteBox";
import InputForm from "../../components/InputForm";
import { labelLayoutBig } from "../../components/Layout/tailwindStyles";
import SelectForm from "../../components/SelectForm";
import { ShowValidationErrors } from "../../components/ShowValidationErrors";
import {
  CableFormValues,
  cableSchema,
  cableClass,
  cableTypes,
  FormProps,
} from "../../model/Cable";

export default function CableFormComponent({
  setError,
  onSubmit,
  defaultValues,
  optionLists,
  isSubmitting,
  isEditForm = false,
}: FormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CableFormValues>({
    defaultValues,
    resolver: zodResolver(cableSchema),
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
    id: string
  ) => {
    if (newValue) {
      // const selectedName: string = newValue.name;
      const updatedInputObject = { ...inputObject }; // Create a shallow copy of the state object

      if (updatedInputObject.cableRack) {
        updatedInputObject.cableRack[parseInt(id)].terminationContainer =
          parseInt(String(newValue.id));
      }
      setInputObject(updatedInputObject);

      if (id.toString() === "0") {
        setValue(
          `cableRack.0.terminationContainer`,
          parseInt(String(newValue.id))
        );
      } else {
        setValue(
          `cableRack.1.terminationContainer`,
          parseInt(String(newValue.id))
        );
      }
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

    //Wenn Fremdleitung gewählt wurde
    if (name === "_class" && value === "ForeignLine") {
      inputObject.fiberCount = 2;
      inputObject.lieferant = null;
    }

    // For Handling array objects
    const fieldArray = inputObject[field as keyof CableFormValues];
    // console.log(fieldArray, field, index, keyName, name, value);
    if (
      Array.isArray(fieldArray) &&
      inputObject &&
      field &&
      name.includes(".")
    ) {
      setInputObject((prevData) => ({
        ...prevData,
        [field as keyof CableFormValues]: [
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
    (x) => x.id === String(inputObject.cableRack?.[0]?.terminationContainer)
  );
  const autoCompleteValueA = optionLists.terminationContainerList[
    indexTerminationA
  ]?.name
    ? optionLists.terminationContainerList[indexTerminationA]?.name
    : "bitte wählen";
  const indexTerminationB = optionLists.terminationContainerList.findIndex(
    (x) => x.id === String(inputObject.cableRack?.[1]?.terminationContainer)
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
      {/* =====Class // Lieferant ==== */}
      <div className={columnLayout}>
        <div className="w-full md:w-1/2 px-3">
          <SelectForm
            data={{
              name: "Klasse",
              modelName: "_class",
              options: cableClass,
              required: true,
              value: inputObject?._class as string,
              disabled: isEditForm,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          {inputObject._class === "ForeignLine" &&
            inputObject?.hasOwnProperty("lieferant") && (
              <>
                <SelectForm
                  data={{
                    name: "Lieferant",
                    modelName: "lieferant",
                    options: optionLists.lieferanten as {
                      id: number;
                      name: string;
                    }[],
                    value: inputObject?.lieferant as number,
                    isNumber: true,
                  }}
                  register={register}
                  errors={errors}
                  handleChange={handleChange}
                />
              </>
            )}
        </div>
      </div>
      {/* =====NAME / Type / CableNo ==== */}
      <div className={columnLayout}>
        <div className="w-full md:w-1/3 px-3">
          <SelectForm
            data={{
              name: "Typ",
              modelName: "type",
              options: cableTypes,
              value: inputObject.type as string,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <InputForm
            data={{
              name: "alt. Name",
              modelName: "altName",
              value: inputObject.altName as string,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/3 px-3">
          <InputForm
            data={{
              name: "Nummer",
              modelName: "cableNo",
              value: inputObject.cableNo as number,
              isNumber: true,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
      </div>
      {/* =====fiberCount / Comment ==== */}
      <div className={columnLayout}>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <InputForm
            data={{
              name: "Faseranzahl",
              modelName: "fiberCount",
              value: inputObject.fiberCount as number,
              isNumber: true,
              required: true,
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
      <div className={columnLayout}>
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
      </div>
      {/* =====Termination Container A / Termination Container B ==== */}
      <div className={columnLayout + " "}>
        {/* ====ROW1===== */}
        <div
          className={`${labelLayoutBig} w-full md:w-1/2 px-3 mb-2 border-r-2`}
        >
          Abschlusselement A
        </div>
        <div className={`${labelLayoutBig} w-full md:w-1/2 px-3 mb-2`}>
          Abschlusselement B
        </div>
        {/* ====ROW2===== */}
        <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
          <InputForm
            data={{
              name: "id (oder)",
              modelName: `cableRack.0.terminationContainer` as const,
              value:
                (inputObject?.cableRack?.[0]?.terminationContainer as number) ??
                0,
              required: true,
              isNumber: true,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
          {errors.cableRack?.[0]?.terminationContainer && (
            <span className="text-red-500 text-sm">
              {errors.cableRack[0].terminationContainer.message}
            </span>
          )}
        </div>
        <div className="w-full md:w-2/6 px-3 mb-6 md:mb-0 border-r-2">
          <AutoCompleteBox
            data={optionLists.terminationContainerList}
            name="Suche"
            modelName="0"
            handleChange={handleAutocompleteChange}
            value={autoCompleteValueA}
          />
        </div>
        <div className="w-full md:w-1/6 px-3">
          <InputForm
            data={{
              name: "id (oder)",
              modelName: `cableRack.1.terminationContainer` as const,
              value:
                (inputObject?.cableRack?.[1]?.terminationContainer as number) ??
                0,
              required: true,
              isNumber: true,
            }}
            register={register}
            errors={errors}
            handleChange={handleChange}
          />
          {errors.cableRack?.[1]?.terminationContainer && (
            <span className="text-red-500 text-sm">
              {errors.cableRack[1].terminationContainer.message}
            </span>
          )}
        </div>
        <div className="w-full md:w-2/6 px-3">
          <AutoCompleteBox
            data={optionLists.terminationContainerList}
            name="Suche"
            modelName="1"
            handleChange={handleAutocompleteChange}
            value={autoCompleteValueB}
          />
        </div>
        {/* ====ROW3===== */}
        {inputObject._class === "ForeignLine" && (
          <>
            <div className={` w-full md:w-1/4 px-3 mb-2`}>
              <InputForm
                data={{
                  name: "Kabelname",
                  modelName: `cableRack.0.cableName` as const,
                  value: inputObject?.cableRack?.[0]?.cableName as string,
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
              {errors.cableRack?.[0]?.cableName && (
                <span className="text-red-500 text-sm">
                  {errors.cableRack[0].cableName.message}
                </span>
              )}
            </div>
            <div className={` w-full md:w-1/4 px-3 mb-2 border-r-2`}>
              <InputForm
                data={{
                  name: "Kommentar",
                  modelName: `cableRack.0.comment` as const,
                  value: inputObject?.cableRack?.[0]?.comment as string,
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
              {errors.cableRack?.[0]?.comment && (
                <span className="text-red-500 text-sm">
                  {errors.cableRack[0].comment.message}
                </span>
              )}
            </div>
            <div className={`w-full md:w-1/4 px-3 mb-2`}>
              <InputForm
                data={{
                  name: "Kabelname",
                  modelName: `cableRack.1.cableName` as const,
                  value: inputObject?.cableRack?.[1]?.cableName as string,
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
              {errors.cableRack?.[1]?.cableName && (
                <span className="text-red-500 text-sm">
                  {errors.cableRack[1].cableName.message}
                </span>
              )}
            </div>
            <div className={`w-full md:w-1/4 px-3 mb-2`}>
              <InputForm
                data={{
                  name: "Kommentar",
                  modelName: `cableRack.1.comment` as const,
                  value: inputObject?.cableRack?.[1]?.comment as string,
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
              {errors.cableRack?.[1]?.comment && (
                <span className="text-red-500 text-sm">
                  {errors.cableRack[1].comment.message}
                </span>
              )}
            </div>
          </>
        )}
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
