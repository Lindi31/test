"use client";

import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import ReactTable from "@/pages/pages/table/ReactTable"; // Stellen Sie sicher, dass Ihr Pfad korrekt ist
import { useRouter } from "next/router";
import { User } from "@/app/api/user";
import { cardStyleInner } from "@/pages/components/Layout/tailwindStyles";
import Action from "@/pages/components/Action";
import Modal, { ModalData } from "@/pages/components/Modal";
import toast, { Toaster } from "react-hot-toast";
import {
  Lieferant,
  Lieferanten,
  deleteLieferant,
  getLieferanten,
  localizeLieferantenKey,
} from "@/pages/model/Lieferant";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSkeleton from "@/pages/components/LoadingIndicator";
import { cn } from "@/lib/utils";
import { getUsers } from "@/pages/model/User";

interface AllSupplierProps {
  user: User;
}

const AllLieferanten: React.FC<AllSupplierProps> = ({ user }) => {
  const [lieferanten, setLieferanten] = useState<Lieferanten | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalData>({});

  useEffect(() => {
    let active = true;

    const fetch = async () => {
      try {
        const lieferanten = await getLieferanten(user);

        if (!active) {
          return;
        }
        setLieferanten(lieferanten);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetch();
    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!lieferanten) {
    return <div>No supplier data found.</div>;
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
    const result = await deleteLieferant(user, modalOptions["id"] as number);
    console.log(result);
    if (result.type === "success") {
      toast.success(`Item with ID ${modalOptions.id} is deleted`);
    } else {
      toast.error(`Error for deleting ID: ${modalOptions.id}`);
    }
  };

  const layout = "p-3";

  const columnHelper = createColumnHelper<Lieferant>();

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
            data={{ id: info.row.original.id as string }}
            actionName="lieferant/edit"
            symbolName="edit"
          />
          <Action
            actionName="lieferant/delete"
            symbolName="delete"
            data={{ id: info.row.original.id as number }}
            handleFunction={(param) => openDeleteModal(param)}
          />
        </>
      ),
    },
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: (info) => localizeLieferantenKey(info.column.id),
      footer: (info) => localizeLieferantenKey(info.column.id),
    }),
    columnHelper.accessor("shortName", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      filterFn: "includesString",
    }),
    columnHelper.accessor("phone", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      filterFn: "includesString",
    }),
    columnHelper.accessor("fax", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      filterFn: "includesString",
    }),
    columnHelper.accessor("eMail", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      filterFn: "includesString",
    }),
    columnHelper.accessor("comment", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      filterFn: "includesString",
    }),
  ];
  const renderLoadingSkeleton = () => (
    <div className="p-2">
      {/* Hier kannst du so viele Skeleton-Komponenten rendern, wie du für die Ladeanzeige benötigst */}

      <CardContent className=" h-[1200px] w-full">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </CardContent>
    </div>
  );
  console.log(lieferanten);

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
        <div className={layout + " pl-9"}>
          <h3 className="text-base font-semibold leading-7">
            Lieferanten Übersicht
          </h3>
          <p
            className="mt-1 
           text-sm leading-6 text-gray-400"
          >
            Liste aller Lieferanten
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
                <CardContent className="p-3">
                  <ReactTable data={lieferanten} columns={columns} />
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
export default AllLieferanten;
