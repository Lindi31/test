import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { labelLayout, selectLayout } from "./Layout/tailwindStyles";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import RedAsterisk from "./RedAsterisk";

export type InputValues = {
  name?: string;
  modelName: string;
  value?: string | number | boolean;
  options?: string[] | { id: number; name: string }[] | number[];
  default?: string | number | { id: number; name: string };
  required?: boolean;
  isNumber?: boolean;
  disabled?: boolean;
};

const defaultInputValues = {
  name: "",
  modelName: "",
  value: "",
  default: "",
  options: [],
  required: false,
  isNumber: false,
  disabled: false,
};

type FormValues = {
  data: InputValues;
  register: any;
  errors: any;
  handleChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export default function SelectForm({
  data,
  register,
  errors,
  handleChange,
}: FormValues) {
  const mergedData = { ...defaultInputValues, ...data };

  // const [selection, setSelection] = useState(defaultInputValues.default.id);
  // const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelection(parseInt(e.target.value));
  // };

  // Type guard to check if an item is an object with 'id' and 'name' properties
  function isObject(item: any): item is { id: number; name: string } {
    return typeof item === "object" && "id" in item && "name" in item;
  }

  return (
    <>
      <label className={labelLayout} htmlFor={"grid-" + mergedData.modelName}>
        {mergedData.name}
        {mergedData.required && <RedAsterisk />}
      </label>
      <div className="relative">
        <select
          {...register(mergedData.modelName, {
            required: mergedData.required,
            valueAsNumber: mergedData.isNumber,
          })}
          className={selectLayout + " mb-3"}
          id={"grid-" + mergedData.modelName}
          // value={mergedData.default as string}
          onChange={handleChange}
          defaultValue={mergedData.default}
          disabled={mergedData.disabled}
        >
          {mergedData.options.map((item, index) => (
            <option
              key={isObject(item) ? item.id : index}
              value={isObject(item) ? item.id : item}
            >
              {isObject(item) ? item.name : item}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <FontAwesomeIcon icon={faCaretDown} className="ml-4" />
        </div>
      </div>
      {errors[mergedData.modelName] && (
        <span className="text-red-500 text-sm">
          {errors[mergedData.modelName].message}
        </span>
      )}
    </>
  );
}
