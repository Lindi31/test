import { inputLayout, labelLayout } from "./Layout/tailwindStyles";
import RedAsterisk from "./RedAsterisk";

export type InputValues = {
  name?: string;
  type?: string;
  modelName: string;
  value?: string | number | boolean | null;
  placeholder?: string;
  required?: boolean;
  isNumber?: boolean;
  disabled?: boolean;
};

const defaultInputValues = {
  name: "",
  modelName: "",
  type: "text",
  value: "",
  placeholder: "",
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

export default function InputForm({
  data,
  register,
  errors,
  handleChange,
}: FormValues) {
  const mergedData = { ...defaultInputValues, ...data };

  const commonInputProps = {
    ...register(mergedData.modelName, {
      required: mergedData.required,
      valueAsNumber: mergedData.isNumber,
    }),
    className: inputLayout + " mb-3",
    id: "grid-" + mergedData.modelName,
    placeholder: mergedData.placeholder,
    value: mergedData.value === null ? "" : mergedData.value,
    onChange: handleChange,
    disabled: mergedData.disabled,
    /**
     * @todo Wenn das Feld Value in einem Formular geändert wird und Enter gedrückt wird, werden die Eingaben in diesem Feld nicht an Data übergeben.
     * Weil Enter einen Submit auslöst, das Eingabefeld dabei aber nicht geblured wird. Siehe https://www.joeltok.com/posts/2022-07-unfocus-input-react-hook-form/
     * Dieser Vorgang kann mit onKeyDown unterbunden werden.
     * Es sollte jedoch eine Allgemeinere Lösung gefunden werden. Die Lösung im Link funktioniert leider nicht.
     * @param e
     * @returns
     */
    onKeyDown: (e: { key: string; currentTarget: { blur: () => void } }) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
        const submitButton = document.getElementById("FormSubmitButton");
        if (submitButton) {
          submitButton.click();
        }
      }
    },
  };

  return (
    <>
      <label className={labelLayout} htmlFor={"grid-" + mergedData.modelName}>
        {mergedData.name}
        {mergedData.required && <RedAsterisk />}
      </label>
      {mergedData.type === "textarea" ? (
        <textarea {...commonInputProps} />
      ) : (
        <input {...commonInputProps} />
      )}
      {errors[mergedData.modelName] && (
        <span className="text-red-500 text-sm">
          {errors[mergedData.modelName].message}
        </span>
      )}
    </>
  );
}
