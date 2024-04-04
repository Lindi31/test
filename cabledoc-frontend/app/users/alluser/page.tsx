// Importing necessary hooks and components from React, Next.js, and other libraries
"use client";
import { createColumnHelper } from "@tanstack/react-table";
import ReactTable from "@/pages/pages/table/ReactTable"; // Adjust import paths as necessary
import Action from "@/pages/components/Action"; // Adjust import paths as necessary
import Modal, { ModalData } from "@/pages/components/Modal"; // Adjust import paths as necessary
import { useEffect, useState } from "react";
import { getUsers } from "../../../pages/model/User";
import { User } from "../../api/user";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeleton from "@/pages/components/LoadingIndicator";
import { Toaster } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cardStyleInner } from "@/pages/components/Layout/tailwindStyles";
interface AllUserProps {
  user: User;
}

const AllUser: React.FC<AllUserProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<ModalData>({
    id: 0 /* oder ein sinnvoller Standardwert */,
  });
  const [users, setUsers] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const fetchUser = async () => {
      try {
        const response = await getUsers(user);
        // Check if the component is still mounted before setting state
        if (active) {
          setUsers(response);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();

    return () => {
      active = false;
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const columnHelper = createColumnHelper<User>();

  // Define columns for ReactTable using columnHelper
  const columns = [
    columnHelper.accessor("id", {
      header: () => "ID",
      cell: (info) =>
        loading ? <Skeleton className="h-4 w-[200px]" /> : info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) =>
        loading ? <Skeleton className="h-4 w-[200px]" /> : info.getValue(),
    }),
    columnHelper.accessor("mail", {
      header: () => "Email",
      cell: (info) =>
        loading ? <Skeleton className="h-4 w-[200px]" /> : info.getValue(),
    }),
    columnHelper.accessor("initials", {
      header: () => "Initialen",
      cell: (info) =>
        loading ? <Skeleton className="h-4 w-[200px]" /> : info.getValue(),
    }),
    columnHelper.accessor("active", {
      header: () => "Aktiv",
      cell: (info) =>
        loading ? (
          <Skeleton className="h-4 w-[200px]" />
        ) : info.getValue() ? (
          "Ja"
        ) : (
          "Nein"
        ),
    }),
    columnHelper.accessor("username", {
      header: () => "Benutzername",
      cell: (info) =>
        loading ? <Skeleton className="h-4 w-[200px]" /> : info.getValue(),
    }),
    columnHelper.accessor("phone", {
      header: () => "Durchwahl",
      cell: (info) =>
        loading ? <Skeleton className="h-4 w-[200px]" /> : info.getValue(),
    }),
    {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info: CustomCellInfo) => (
        <>
          <div className="flex">
            <Action
              data={{ id: info.row.original.id as number }}
              actionName="users/alluser"
            />
            <Action
              data={{ id: info.row.original.id as number }}
              actionName="users/edituser"
              symbolName="edit"
            />
            <Action
              actionName="users/delete"
              symbolName="delete"
              data={{ id: info.row.original.id as number }}
              handleFunction={(param) => openDeleteModal(param)}
            />
          </div>
        </>
      ),
    },
  ];
  type CustomCellInfo = {
    row: {
      original: {
        id: string | number | boolean | null | undefined;
      };
    };
  };
  const openDeleteModal = (data: ModalData) => {
    setIsModalOpen(true);
    setModalOptions(data);
  };

  const closeDeleteModal = () => setIsModalOpen(false);

  const handleDelete = async (id: string | number | undefined) => {
    if (id === undefined) {
      console.error("ID is undefined");
      return;
    }

    console.log(`Deleting user with ID ${id}`);
    setIsModalOpen(false);
    // Optionally refresh user list after delete
  };

  if (loading) return <LoadingSkeleton />;

  if (!users) return <p>x</p>;
  const renderLoadingSkeleton = () => (
    <div className="p-2">
      {/* Hier kannst du so viele Skeleton-Komponenten rendern, wie du für die Ladeanzeige benötigst */}

      <CardContent className="w-full h-fit">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </CardContent>
    </div>
  );

  const layout = "p-3";
  return (
    <>
      <div className={"text-left h-fit w-full " + cardStyleInner}>
        <div className={layout + " pl-9"}>
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
          <div className="p-2">
            {loading ? (
              renderLoadingSkeleton()
            ) : (
              <>
                <CardContent className="p-3 self-center items-center">
                  <ReactTable data={users} columns={columns} />
                </CardContent>
              </>
            )}
          </div>
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
};

export default AllUser;
