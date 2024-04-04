/**
 * @todo refactor this to use React query for caching https://tanstack.com/query/v5/
 * @todo refactor this to use Suspense
 */
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { createColumnHelper } from "@tanstack/react-table";
import ReactTable from "../table/ReactTable";
import {
  Locations,
  Locateable,
  deleteLocateable,
  getStandorte,
  getStandorteQuery,
} from "../../model/Location";
import {
  cardHeaderColorPrimary,
  cardStyleInner,
} from "../../components/Layout/tailwindStyles";
import {
  formatDate,
  replacePathPlaceholders,
} from "../../ressources/functions";
import Action from "../../components/Action";
import Modal, { ModalData } from "../../components/Modal";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import { User } from "../../../app/api/user";
import ActionBar from "../../components/ActionBar";
import actionBarElements from "./actionMenuLocation";

type CustomCellInfo = {
  row: {
    original: {
      id:
        | string
        | number
        | boolean
        | ReactElement<any, string | JSXElementConstructor<any>>
        | Iterable<ReactNode>
        | ReactPortal
        | null
        | undefined;
    };
  };
};

export default function AllLocations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalData>({});

  const user: User = useOutletContext();

  const standorteQuery = getStandorteQuery(user);
  // console.log(standorteQuery.data);

  if (standorteQuery.isError) {
    return <p>Error, could not load Standorte.</p>;
  }

  if (standorteQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (!standorteQuery.hasOwnProperty("data") || !standorteQuery.data) {
    return <p>No Data available...</p>;
  }

  /**
   * gets called if in the modal is clicked yes
   */
  const handleDelete = async () => {
    try {
      const result = await deleteLocateable(user, modalOptions["id"] as number);
      console.log(result);
    } catch (error) {
      console.error("Error deleting location:", error);
    }
    toast.success(`Item with ID ${modalOptions.id} deleted`);
    console.log(`Item with ID ${modalOptions.id} deleted`);
  };

  const openDeleteModal = (data: ModalData) => {
    setModalOptions(data);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const layout = "p-3";

  const columnHelper = createColumnHelper<Locateable>();

  const columns = [
    {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info: CustomCellInfo) => (
        <>
          <Action
            data={{ id: info.row.original.id as number }}
            actionName="location"
          />
          <Action
            data={{ id: info.row.original.id as number }}
            actionName="location/edit"
            symbolName="edit"
          />
          <Action
            actionName="location/delete"
            symbolName="delete"
            data={{ id: info.row.original.id as number }}
            handleFunction={(param) => openDeleteModal(param)}
          />
        </>
      ),
    },
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      filterFn: "includesString",
    }),
    columnHelper.accessor("type", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      // filterFn: 'fuzzy',
      filterFn: "includesString",
    }),

    columnHelper.accessor((row) => row.comment, {
      id: "comment",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Kommentar</span>,
      footer: (info) => info.column.id,
      filterFn: "includesString",
    }),
    columnHelper.group({
      id: "Address",
      header: () => <span>Adresse</span>,
      // footer: (props) => props.column.id,
      columns: [
        columnHelper.accessor("ort", {
          cell: (info) => info.getValue(),
          header: () => <span>Ort</span>,
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
        columnHelper.accessor("plz", {
          cell: (info) => info.getValue(),
          header: () => <span>plz</span>,
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
        columnHelper.accessor((row) => row.strasse, {
          id: "strasse",
          cell: (info) => info.getValue(),
          header: () => <span>Strasse</span>,
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
        columnHelper.accessor((row) => row.hausNr, {
          id: "hausNr",
          cell: (info) => info.getValue(),
          header: () => <span>HausNr.</span>,
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
      ],
    }),
    columnHelper.accessor((row) => formatDate(row.lastModifiedAt as any), {
      id: "Geändert",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Geändert</span>,
      footer: (info) => info.column.id,
      filterFn: "includesString",
    }),
    // columnHelper.accessor("lastModifiedAt", {
    //   accessorFn: (row: any) => formatDate(row.lastModifiedAt),
    //   id: "Geändert",
    //   header: () => <span>Geändert</span>,
    //   cell: (info) => info.getValue(),
    //   footer: (info) => info.column.id,
    //   filterFn: "includesString",
    // }),
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
        actionList={replacePathPlaceholders(actionBarElements, {})}
        highlight="Übersicht"
        settings={{ showMoreButtonGreaterThen: 5 }}
      />
      <div className={"text-left h-fit w-full " + cardStyleInner}>
        <div
          className={`${layout} ${cardHeaderColorPrimary} pb-1 rounded-t-lg text-white`}
        >
          <h3 className="text-base font-semibold leading-7">
            Standort Übersicht
          </h3>
          <p
            className="mt-1 
           text-sm leading-6 text-white-400"
          >
            Liste aller Standorte
          </p>
        </div>
        <div
          className={layout + " border-t border-gray-100 dark:border-gray-600"}
        >
          <ReactTable data={standorteQuery.data} columns={columns} />
        </div>
      </div>
    </>
  );
}
