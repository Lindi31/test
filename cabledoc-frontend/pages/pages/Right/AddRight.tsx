import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import InputForm from "../../components/InputForm";
import { removeEmptyValues } from "../../ressources/functions";
import { useNavigate, useOutletContext } from "react-router-dom";
import { User } from "../../../app/api/user";
import {
  Right,
  RightFormValues,
  addRight,
  rightSchema,
} from "../../model/Right";

export default function AddRight() {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputObject, setInputObject] = useState<Right>({
    name: "",
  });
  const navigate = useNavigate();

  const user: User = useOutletContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RightFormValues>({
    resolver: zodResolver(rightSchema),
  });

  const onSubmit: SubmitHandler<RightFormValues> = async (data) => {
    setLoading(true);
    const modifiedData = removeEmptyValues({
      ...data,
      ...inputObject,
    });
    console.log(modifiedData);
    const result = await addRight(user, modifiedData);
    console.log(result);

    if (result) {
      toast.success("Form successfully transfered to Backend!");
      navigate("/rights");
    } else {
      toast.error(
        "An error occurred during Validation. Please try again later."
      );
    }
    setLoading(false);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputObject((prevData) => ({ ...prevData, [name]: value }));
  };

  const layout = "p-3 text-left";
  const columnLayout = "flex flex-wrap -mx-3 mb-5";

  return (
    <>
      <div className={layout + " " + cardStyleInner + " max-w-2xl"}>
        <h1 className="text-2xl font-bold mb-4">neues Recht anlegen</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          {loading && <div className="mb-4 text-3xl">Loading...</div>}
          {/* =====NAME ==== */}
          <div className={columnLayout}>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <InputForm
                data={{
                  name: "Name",
                  modelName: "name",
                  value: inputObject?.name,
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
          >
            Send
          </button>
        </form>
        <Toaster />
      </div>
    </>
  );
}
