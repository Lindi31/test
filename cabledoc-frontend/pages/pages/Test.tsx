import { useState } from "react";
import { useUserStore } from "../../app/api/user";
import { SubmitHandler, useForm } from "react-hook-form";
import { cardStyleInner } from "../components/Layout/tailwindStyles";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../components/Modal";

const commaToPeriod = (value: string) => value.replace(",", ".");

//Zod schema
export const zodSchema = z.object({
  name: z.string().min(2),
  nummer: z.preprocess(
    (val) => parseFloat(z.string().transform(commaToPeriod).parse(val)),
    z.number().optional().nullable()
  ),
});

type FormValues = z.infer<typeof zodSchema>;

export default function Test({}: {}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(zodSchema),
  });

  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [name2, setName2] = useState("");

  const { user } = useUserStore();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(e.target[0].value);
  };

  const onSubmit2: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    console.log("Item deleted");
    closeDeleteModal();
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const testMethod = () => {
    console.log("Test Method");
    // console.log(result);
  };

  // const onSubmit2 = (data: FormValues) => {
  //   console.log("Submitted data:", data);
  // };

  const ButtonComponent: React.FC = () => {
    const handleClick = () => {
      throw new Error("An error occurred");
    };

    return (
      <>
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          onClick={handleClick}
        >
          Provocate an Error
        </button>
        <br />
      </>
    );
  };

  //https://www.robinwieruch.de/react-router-authentication/
  return (
    <>
      <h1 className="p-3">Test</h1>
      <ButtonComponent />
      <button
        onClick={openDeleteModal}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Open Delete Modal
      </button>
      {isModalOpen && (
        <Modal
          data={{ id: 5 }}
          onDelete={handleDelete}
          close={closeDeleteModal}
        ></Modal>
      )}
      <div>
        <h1>Test Button to call some Test Methods</h1>
        <button
          onClick={testMethod}
          className="bg-yellow-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Test Methodd
        </button>
      </div>

      <div className="p-8">
        <div>Authenticated as {user?.username}</div>
        <button
          className="bg-emerald-500 rounded border text-white p-2"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>

      <div className={"p-3 text-left" + " " + cardStyleInner + " max-w-2xl"}>
        <form onSubmit={onSubmit} className="max-w-2xl">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className={
                "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              }
              htmlFor="grid-name"
            >
              Name
            </label>
            <input
              className={
                "appearance-none block rounded w-full py-2 px-4 bg-gray-200 text-gray-700 border border-gray-200 focus:border-gray-500 leading-tight focus:outline-none focus:bg-white" +
                " mb-3"
              }
              id="grid-name"
              type="text"
              placeholder=""
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
          >
            Send
          </button>
          <button
            className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
            onClick={() => setName("hansi")}
          >
            Set InputValue
          </button>
        </form>
      </div>
      {/* ===========FORM 2=========== */}
      <div className={"p-3 text-left" + " " + cardStyleInner + " max-w-2xl"}>
        <form onSubmit={handleSubmit(onSubmit2)} className="Zod">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className={
                "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              }
              htmlFor="grid-name"
            >
              Name
            </label>
            <input
              {...register("name")}
              className={
                "appearance-none block rounded w-full py-2 px-4 bg-gray-200 text-gray-700 border border-gray-200 focus:border-gray-500 leading-tight focus:outline-none focus:bg-white" +
                " mb-3"
              }
              id="grid-name"
              type="text"
              placeholder=""
              onChange={(e) => setName2(e.target.value)}
              value={name2}
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className={
                "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              }
              htmlFor="grid-name"
            >
              Nummer
            </label>
            <input
              {...register("nummer")}
              className={
                "appearance-none block rounded w-full py-2 px-4 bg-gray-200 text-gray-700 border border-gray-200 focus:border-gray-500 leading-tight focus:outline-none focus:bg-white" +
                " mb-3"
              }
              id="grid-nummer"
              type="text"
              placeholder=""
            />
            {errors.nummer && <p>{errors.nummer.message}</p>}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
          >
            Send
          </button>
          <button
            className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
            onClick={() => setName2("hansi")}
          >
            Set InputValue
          </button>
        </form>
      </div>
      <br />
      <div style={{ borderRadius: "0.375rem" }} className="overflow-hidden">
        <table className="w-full border-collapse border-gray-300">
          <thead style={{ backgroundColor: "#E5E7EB" }}>
            <tr>
              <th className="border border-gray-300 py-2 px-4">Header 1</th>
              <th className="border border-gray-300 py-2 px-4">Header 2</th>
              <th className="border border-gray-300 py-2 px-4">Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 py-2 px-4">
                Row 1, Cell 1
              </td>
              <td className="border border-gray-300 py-2 px-4">
                Row 1, Cell 2
              </td>
              <td className="border border-gray-300 py-2 px-4">
                Row 1, Cell 3
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-2 px-4">
                Row 2, Cell 1
              </td>
              <td className="border border-gray-300 py-2 px-4">
                Row 2, Cell 2
              </td>
              <td className="border border-gray-300 py-2 px-4">
                Row 2, Cell 3
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-2 px-4">
                Row 3, Cell 1
              </td>
              <td className="border border-gray-300 py-2 px-4">
                Row 3, Cell 2
              </td>
              <td className="border border-gray-300 py-2 px-4">
                Row 3, Cell 3
              </td>
            </tr>
          </tbody>
          <tfoot style={{ backgroundColor: "#E5E7EB" }}>
            <tr>
              <td className="border border-gray-300 py-2 px-4">Footer 1</td>
              <td className="border border-gray-300 py-2 px-4">Footer 2</td>
              <td className="border border-gray-300 py-2 px-4">Footer 3</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
