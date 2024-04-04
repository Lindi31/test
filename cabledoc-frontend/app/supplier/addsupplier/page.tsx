// Import necessary hooks and components from Next.js, React, and additional dependencies
"use client";
import { useState, ChangeEvent, FC } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";

// Import the schema, interfaces, and functions from your application's structure
import { cardStyleInner } from "../../../pages/components/Layout/tailwindStyles";
import InputForm from "../../../pages/components/InputForm";
import { removeEmptyValues } from "../../../pages/ressources/functions";
import { User } from "../../api/user";
import {
  Lieferant,
  LieferantFormValues,
  LieferantSchema,
  addLieferant,
} from "../../../pages/model/Lieferant";
import React from "react";

// TypeScript interface for props if needed (optional)
const layout = "p-3 text-left";
const columnLayout = "flex flex-wrap -mx-3 mb-5";
// Main component
const AddLieferant: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputObject, setInputObject] = useState<Lieferant>({
    id: null,
    name: null,
    shortName: null,
    phone: null,
    fax: null,
    eMail: null,
    comment: null,
  });

  // Placeholder for user fetching logic
  const user: User = {}; // Replace with actual logic to obtain user data

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LieferantFormValues>({
    resolver: zodResolver(LieferantSchema),
  });

  const onSubmit: SubmitHandler<LieferantFormValues> = async (data) => {
    setLoading(true);
    const modifiedData = removeEmptyValues({
      ...data,
      ...inputObject,
    });

    const result = await addLieferant(user, modifiedData);

    if (result) {
      toast.success("Lieferant erfolgreich hinzugefügt!");
    } else {
      toast.error(
        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
      );
    }
    setLoading(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputObject((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className={`${cardStyleInner} p-3 text-left max-w-2xl`}>
        <h1 className="text-2xl font-bold mb-4">Neuen Lieferanten anlegen</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          {loading && <div className="mb-4 text-3xl">Loading...</div>}
          {/* =====NAME / Shortname  ==== */}
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
          {/* =====phone / Fax ==== */}
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
          {/* =====comment ==== */}
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
};

export default AddLieferant;
