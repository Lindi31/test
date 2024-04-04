import { useEffect, useState } from "react";
import { Users, editUser, getUsers, localizeUserKey } from "../../model/User";
import { createColumnHelper } from "@tanstack/react-table";
import ReactTable from "../table/ReactTable";
import { useOutletContext } from "react-router-dom";
import { User } from "../../../app/api/user";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import Action from "../../components/Action";
import Modal, { ModalData } from "../../components/Modal";
import toast, { Toaster } from "react-hot-toast";

export default function AllUsersReactTable() {
  const [users, setUsers] = useState<Users | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalData>({});

  const user: User = useOutletContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getUsers(user);
        if (!active) {
          return;
        }
        setUsers(users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };
    let active = true;
    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  type CustomCellInfo = {
    row: {
      original: {
        id: string | number | boolean | null | undefined;
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
    const userData = {
      id: modalOptions["id"],
      active: false,
    };
    const result = await editUser(user, userData as User);
    console.log(result);
    if (result) {
      toast.success(`Item with ID ${modalOptions.id} is set inactive`);
    } else {
      toast.error(`Error for deleting ID: ${modalOptions.id}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!users) {
    return <div>No user data found.</div>;
  }

  const layout = "p-3";

  const columnHelper = createColumnHelper<User>();

  const columns = [
    {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info: CustomCellInfo) => (
        <>
          <Action
            data={{ id: info.row.original.id as number }}
            actionName="user"
          />
          <Action
            data={{ id: info.row.original.id as number }}
            actionName="user/edit"
            symbolName="edit"
          />
          <Action
            actionName="user/delete"
            symbolName="delete"
            data={{ id: info.row.original.id as number }}
            handleFunction={(param) => openDeleteModal(param)}
          />
        </>
      ),
    },
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: (info) => localizeUserKey(info.column.id),
      footer: (info) => localizeUserKey(info.column.id),
    }),
    columnHelper.accessor("active", {
      cell: (info) => info.getValue(),
      header: (info) => localizeUserKey(info.column.id),
      footer: (info) => localizeUserKey(info.column.id),
    }),
    columnHelper.accessor("initials", {
      cell: (info) => info.getValue(),
      header: (info) => localizeUserKey(info.column.id),
      footer: (info) => localizeUserKey(info.column.id),
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: (info) => localizeUserKey(info.column.id),
      footer: (info) => localizeUserKey(info.column.id),
    }),
    columnHelper.accessor((row) => row.username, {
      id: "username",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>User Name</span>,
      footer: (info) => localizeUserKey(info.column.id),
    }),
    columnHelper.accessor("mail", {
      cell: (info) => info.getValue(),
      header: (info) => localizeUserKey(info.column.id),
      footer: (info) => localizeUserKey(info.column.id),
    }),
    columnHelper.accessor("phone", {
      header: (info) => localizeUserKey(info.column.id),
      footer: (info) => localizeUserKey(info.column.id),
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
            Liste aller User
          </p>
        </div>
        <div
          className={
            layout + " mt-2 border-t border-gray-100 dark:border-gray-600"
          }
        >
          <ReactTable data={users} columns={columns} />
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
