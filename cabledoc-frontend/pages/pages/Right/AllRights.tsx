import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import ReactTable from "../table/ReactTable";
import { useNavigate, useOutletContext } from "react-router-dom";
import { User } from "../../../app/api/user";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import Action from "../../components/Action";
import Modal, { ModalData } from "../../components/Modal";
import toast, { Toaster } from "react-hot-toast";
import {
  Right,
  Rights,
  deleteRight,
  getRights,
  localizeRightKey,
} from "../../model/Right";

export default function AllRights() {
  const [rights, setRights] = useState<Rights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalData>({});
  const navigate = useNavigate();

  const user: User = useOutletContext();

  useEffect(() => {
    const fetch = async () => {
      try {
        const rights = await getRights(user);
        if (!active) {
          return;
        }
        setRights(rights);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };
    let active = true;
    fetch();
    return () => {
      active = false;
    };
  }, []);

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
    const result = await deleteRight(user, modalOptions["id"] as string);
    console.log(result);
    if (result.type === "success") {
      toast.success(`Item with ID ${modalOptions.id} is deleted`);
      navigate("/rights");
    } else {
      toast.error(`Error for deleting ID: ${modalOptions.id}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!rights) {
    return <div>No Right data found.</div>;
  }

  const layout = "p-3";

  const columnHelper = createColumnHelper<Right>();

  const columns = [
    {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info: CustomCellInfo) => (
        <>
          {/* <Action
            data={{ id: info.row.original.name as string }}
            actionName="rights"
          /> */}
          <Action
            data={{ id: info.row.original.name as string }}
            actionName="right/edit"
            symbolName="edit"
          />
          <Action
            actionName="right/delete"
            symbolName="delete"
            data={{ id: info.row.original.name as string }}
            handleFunction={(param) => openDeleteModal(param)}
          />
        </>
      ),
    },
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: (info) => localizeRightKey(info.column.id),
      footer: (info) => localizeRightKey(info.column.id),
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
      <div className={"text-left h-fit w-full " + cardStyleInner}>
        <div className={layout}>
          <h3 className="text-base font-semibold leading-7">User Übersicht</h3>
          <p
            className="mt-1 
           text-sm leading-6 text-gray-400"
          >
            Liste aller Rechte
          </p>
        </div>
        <div
          className={
            layout + " mt-2 border-t border-gray-100 dark:border-gray-600"
          }
        >
          <ReactTable data={rights} columns={columns} />
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
