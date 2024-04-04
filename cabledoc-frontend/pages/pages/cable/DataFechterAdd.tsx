import { useMutation } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  CableFormValues,
  createCable,
  createForeignLine,
} from "../../model/Cable";
import { getLieferantenQuery, Lieferant } from "../../model/Lieferant";
import { getTerminationContainerListQuery } from "../../model/Location";
import { removeEmptyValues } from "../../ressources/functions";
import { User } from "../../../app/api/user";
import CableFormComponent from "./CableFormComponent";
import toast from "react-hot-toast";
import { getReadableError } from "../../../app/api/axios";

export default function DataFechterAdd({
  setError,
}: {
  setError?: (error: string[]) => void;
}) {
  const user: User = useOutletContext();
  const navigate = useNavigate();

  const lieferanten = getLieferantenQuery(user);
  const terminationContainerList = getTerminationContainerListQuery(user);

  const mutation = useMutation({
    mutationFn: (data: CableFormValues) => {
      const modifiedData = removeEmptyValues({
        ...data,
      });
      // console.log(modifiedData);
      if (modifiedData._class === "ForeignLine") {
        return createForeignLine(user, modifiedData, modifiedData.fiberCount);
      } else {
        return createCable(user, modifiedData, modifiedData.fiberCount);
      }
    },
    // onMutate: (variables) => {
    //   console.log(variables);
    //   // Optionally return a context containing data to use when for example rolling back
    //   return { id: 1 };
    // },
    // onSuccess: async (data, variables, context) => {
    //   console.log("I'm first!", data, variables, context);
    // },
    // onSettled: async () => {
    //   console.log("I'm second!");
    // },
    // onError: async (error, variables, context) => {
    //   console.log(error);
    // },
  });

  if (lieferanten.isError || terminationContainerList.isError) {
    return <p>Error, could not load form.</p>;
  }

  if (lieferanten.isLoading || terminationContainerList.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CableFormComponent
        // defaultValues={{ _class, comment, fiberCount: fiberCount ?? 0 }}
        defaultValues={{
          _class: "OwnCable",
          type: "LWL",
          altName: "",
          cableNo: null,
          fiberCount: 2,
          cableRack: [{ terminationContainer: 0 }, { terminationContainer: 0 }],
          comment: "",
          length: 0,
        }}
        optionLists={{
          lieferanten: lieferanten.data as Lieferant[],
          terminationContainerList: terminationContainerList.data as {
            name: string;
            id: string;
          }[],
        }}
        onSubmit={async (data) => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }

          try {
            if (setError) setError([]);
            const response = await mutation.mutateAsync(data);
            console.log(response);
          } catch (error) {
            if (setError) setError(getReadableError(error));
            throw error;
          }

          toast.success("Cable successfully added!");
          navigate("/cables");
        }}
        isSubmitting={mutation.isPending}
      />
    </>
  );
}
