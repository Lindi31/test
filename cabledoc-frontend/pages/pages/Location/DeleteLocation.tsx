import {
  Params,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import Modal from "../../components/Modal";
import { deleteLocateable } from "../../model/Location";
import { User } from "../../../app/api/user";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

interface Data {
  name?: string;
  id?: number;
}

export default function DeleteLocation({}: {}) {
  const params = useParams<Params>();
  const user: User = useOutletContext();
  const [modalOptions] = useState<Data>({
    id: Number(params.id),
    name: "Location: ",
  });
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const result = await deleteLocateable(user, modalOptions["id"] as number);
      console.log(result);
      navigate("/locations/");
    } catch (error) {
      console.error("Error deleting location:", error);
    }
    toast.success(`Item with ID ${modalOptions.id} deleted`);
    console.log(`Item with ID ${modalOptions.id} deleted`);
  };

  return (
    <>
      <div className={"text-left " + cardStyleInner}>
        {isModalOpen && (
          <Modal
            onDelete={handleDelete}
            close={closeDeleteModal}
            data={modalOptions}
          ></Modal>
        )}
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
