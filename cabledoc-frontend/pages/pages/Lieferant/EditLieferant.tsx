import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { User } from "../../../app/api/user";
import InputForm from "../../components/InputForm";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import { axiosErrorHandler } from "../../../app/api/axios";
import { isSuccess, removeEmptyValues } from "../../ressources/functions";
import {
  Lieferant,
  LieferantSchema,
  editLieferant,
  getLieferant,
} from "../../model/Lieferant";

type FormValues = z.infer<typeof LieferantSchema>;

export default function EditLieferant() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [inputObject, setInputObject] = useState<Lieferant>({
    name: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const result = await getLieferant(user, parseInt(id as string));
      setInputObject(result);
      setLoading(false);
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const user: User = {}; // Dummy-Platzhalter

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(LieferantSchema),
  });

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
    const result = await editLieferant(user, modifiedData);

    if (result && result.type === "success" && isSuccess(result)) {
      toast.success("Form successfully transferred to Backend!");
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
          {"Lieferant " + id + " bearbeiten"}{" "}
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
            <div className="w-full md:w-1/2 px-3">
              <InputForm
                data={{
                  name: "Kürzel",
                  modelName: "shortName",
                  value: inputObject?.shortName,
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className={columnLayout}>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <InputForm
                data={{
                  name: "Telefon",
                  modelName: "phone",
                  value: inputObject?.phone,
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/3 px-3">
              <InputForm
                data={{
                  name: "Fax",
                  modelName: "fax",
                  value: inputObject?.fax,
                  type: "text",
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/3 px-3">
              <InputForm
                data={{
                  name: "EMail",
                  modelName: "eMail",
                  value: inputObject?.eMail,
                  type: "text",
                }}
                register={register}
                errors={errors}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className={columnLayout}>
            <div className="w-full  px-3 mb-6 md:mb-0">
              <InputForm
                data={{
                  name: "Kommentar",
                  modelName: "comment",
                  value: inputObject?.comment,
                  type: "textarea",
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
