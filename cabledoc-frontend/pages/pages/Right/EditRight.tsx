import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Params, useParams } from "react-router-dom";
import { User } from "../../../app/api/user";
import InputForm from "../../components/InputForm";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import { Params, useOutletContext, useParams } from "react-router-dom";
import { isSuccess, removeEmptyValues } from "../../ressources/functions";
import { axiosErrorHandler } from "../../../app/api/axios";
import { Right, editRight, getRight, rightSchema } from "../../model/Right";

type FormValues = z.infer<typeof rightSchema>;

// Define a form component that uses the custom hook
export default function EditRight() {
  const params = useParams<Params>();
  const [loading, setLoading] = useState<boolean>(false);
  const [inputObject, setInputObject] = useState<Right>({
    name: "",
  });

  if (!params.name) {
    throw new Error("Parameter kann nich gelesen werden");
  }
  const name = params.name;
  const user: User = useOutletContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(rightSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const userDataResult = await getRight(user, name as string);
      setInputObject(userDataResult);
      if (!active) {
        return;
      }
      setLoading(false);
    };

    let active = true;
    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputObject((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    const modifiedData = removeEmptyValues({
      ...data,
      ...inputObject,
    });
    console.log(modifiedData);
    const result = await editRight(user, modifiedData);
    console.log(result);

    if (result && result.type === "success" && isSuccess(result)) {
      toast.success("Form successfully transfered to Backend!");
    } else {
      if (isSuccess(result)) {
        let message = axiosErrorHandler(result.data[0].error);
        toast.error(
          "An error occurred during Validation. Please try again later: " +
            message
        );
      }
    }
    setLoading(false);
  };

  const layout = "p-3 text-left";
  const columnLayout = "flex flex-wrap -mx-3 mb-6";

  return (
    <>
      <div className={layout + " " + cardStyleInner + " max-w-2xl"}>
        <h1 className="text-2xl font-bold mb-4">
          {"Recht " + name + " bearbeiten"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          {loading && <div className="mb-4 text-3xl">Loading...</div>}
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
