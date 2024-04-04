// Importing necessary hooks and components from Next.js, React, and other libraries
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { cardStyleInner } from "@/pages/components/Layout/tailwindStyles";
import { getUser, editUser, userSchema } from "@/pages/model/User";
import { axiosErrorHandler } from "@/app/api/axios";

import { removeEmptyValues, isSuccess } from "@/pages/ressources/functions";
import { User } from "@/app/api/user";

type FormValues = z.infer<typeof userSchema>;

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [inputObject, setInputObject] = useState<User>({});
  const [user, setUser] = useState<User | null>(null); // Assuming you have a way to get this, possibly from a global state or context

  useEffect(() => {
    if (!id) {
      toast.error("User ID is required.");
      router.push("/"); // Redirect to a default page if ID is missing
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        if (user) {
          const userDataResult = await getUser(user, Number(id));
          // Rest des Codes...

          if (userDataResult) {
            setInputObject(userDataResult);
            setUser(userDataResult);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUser();
  }, [id, user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          name: user.name,
          // Populate other fields as needed
        }
      : {},
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

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const modifiedData = removeEmptyValues({
      ...data,
      ...inputObject,
    });
    try {
      if (user) {
        const result = await editUser(user, modifiedData);
        if (result && isSuccess(result)) {
          toast.success("User updated successfully.");
        } else {
          throw new Error("Error updating user.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during the update process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`p-3 text-left ${cardStyleInner} max-w-2xl`}>
        <h1 className="text-2xl font-bold mb-4">Edit User {id}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          {loading && <div className="mb-4 text-3xl">Loading...</div>}
          {/* Form fields and InputForm components go here */}
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
          >
            Save Changes
          </button>
        </form>
      </div>
      <Toaster />
    </>
  );
}
