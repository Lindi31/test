import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import ReactTable from "../table/ReactTable";
import { useNavigate, useOutletContext } from "react-router-dom";
import { User } from "../../../app/api/user";
import {
  cardHeaderColorPrimary,
  cardStyleInner,
} from "../../components/Layout/tailwindStyles";
import Action from "../../components/Action";
import Modal, { ModalData } from "../../components/Modal";
import toast, { Toaster } from "react-hot-toast";
import {
  Cable,
  deleteCable,
  getCablesQuery,
  localizeCableKey,
} from "../../model/Cable";
import actionBarElementCables from "./actionMenuCable";
import ActionBar from "../../components/ActionBar";
import { replacePathPlaceholders } from "../../ressources/functions";

export default function AllCables() {
  const user: User = useOutletContext();

  const cablesQuery = getCablesQuery(user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalData>({});
  const navigate = useNavigate();

  if (cablesQuery.isError) {
    return <p>Error, could not load Cables.</p>;
  }

  if (cablesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (!cablesQuery.hasOwnProperty("data") || !cablesQuery.data) {
    return <p>No Data available...</p>;
  }

  type CustomCellInfo = {
    row: {
      original: {
        id: string | number | boolean | null | undefined;
        name: string | number | boolean | null | undefined;
      };
    };
  };

  const openDeleteModal = (data: ModalData) => {
    setModalOptions(data);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    const result = await deleteCable(user, modalOptions["id"] as number);
    console.log(result);
    if (result.type === "success") {
      toast.success(`Item with ID ${modalOptions.id} is deleted`);
      navigate("/rights");
    } else {
      toast.error(`Error for deleting ID: ${modalOptions.id}`);
    }
  };

  const layout = "p-3";

  const columnHelper = createColumnHelper<Cable>();

  const columns = [
    {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info: CustomCellInfo) => (
        <>
          <Action
            data={{ id: info.row.original.id as number }}
            actionName="cable"
          />
          <Action
            data={{ id: info.row.original.id as number }}
            actionName="cable/edit"
            symbolName="edit"
          />
          <Action
            actionName="cable/delete"
            symbolName="delete"
            data={{ id: info.row.original.id as number }}
            handleFunction={(param) => openDeleteModal(param)}
          />
        </>
      ),
    },
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: (info) => localizeCableKey(info.column.id),
      footer: (info) => localizeCableKey(info.column.id),
    }),
    columnHelper.accessor("_class", {
      cell: (info) => info.getValue(),
      header: (info) => localizeCableKey(info.column.id),
      footer: (info) => localizeCableKey(info.column.id),
    }),
    columnHelper.accessor("type", {
      cell: (info) => info.getValue(),
      header: (info) => localizeCableKey(info.column.id),
      footer: (info) => localizeCableKey(info.column.id),
    }),
    columnHelper.accessor("cableNo", {
      cell: (info) => info.getValue(),
      header: (info) => localizeCableKey(info.column.id),
      footer: (info) => localizeCableKey(info.column.id),
    }),
    columnHelper.accessor("altName", {
      cell: (info) => info.getValue(),
      header: (info) => localizeCableKey(info.column.id),
      footer: (info) => localizeCableKey(info.column.id),
    }),
    columnHelper.accessor("fiberCount", {
      cell: (info) => info.getValue(),
      header: (info) => localizeCableKey(info.column.id),
      footer: (info) => localizeCableKey(info.column.id),
    }),
    columnHelper.accessor("length", {
      cell: (info) => info.getValue(),
      header: (info) => localizeCableKey(info.column.id),
      footer: (info) => localizeCableKey(info.column.id),
    }),
  ];

  return (
    <>
      {isModalOpen && (
        <Modal
          onDelete={handleDelete}
          close={closeDeleteModal}
          data={modalOptions}
        ></Modal>
      )}
      <ActionBar
        actionList={replacePathPlaceholders(actionBarElementCables, {})}
        highlight="Übersicht"
        settings={{ showMoreButtonGreaterThen: 5 }}
      />
      <div className={"text-left h-fit w-full " + cardStyleInner}>
        <div
          className={`${layout} ${cardHeaderColorPrimary} pb-1 rounded-t-lg text-white`}
        >
          <h3 className="text-base font-semibold leading-7">Kabel Übersicht</h3>
          <p className="mt-1 text-sm leading-6 text-white-400">
            Liste aller Kabel
          </p>
        </div>
        <div
          className={layout + " border-t border-gray-100 dark:border-gray-600"}
        >
          <ReactTable data={cablesQuery.data} columns={columns} />
        </div>
        <Toaster
          position="top-center"
          gutter={24}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
    </>
  );
}
