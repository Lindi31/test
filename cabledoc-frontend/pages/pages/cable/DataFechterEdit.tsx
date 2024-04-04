import { useMutation } from "@tanstack/react-query";
import { Params, useNavigate, useOutletContext } from "react-router-dom";
import { getCableQuery, CableFormValues, editCable } from "../../model/Cable";
import { getLieferantenQuery, Lieferant } from "../../model/Lieferant";
import { getTerminationContainerListQuery } from "../../model/Location";
import { removeEmptyValues } from "../../ressources/functions";
import { User } from "../../../app/api/user";
import CableFormComponent from "./CableFormComponent";
import toast from "react-hot-toast";
import { getReadableError } from "../../../app/api/axios";
import { queryClient } from "../../main";

export default function DataFechterEdit({
  params,
  setError,
}: {
  params: Params;
  setError?: (error: string[]) => void;
}) {
  const user: User = useOutletContext();
  const id = parseInt(params.id as string);
  const navigate = useNavigate();

  const cableQuery = getCableQuery(user, id, true);

  //modify cableQuery
  delete cableQuery.data?.fibers;

  const lieferanten = getLieferantenQuery(user);
  const terminationContainerList = getTerminationContainerListQuery(user);

  const mutation = useMutation({
    mutationFn: (data: CableFormValues) => {
      const modifiedData = removeEmptyValues({
        ...data,
        ...{ id: id },
      });
      console.log(modifiedData);
      const response = editCable(user, modifiedData, id);
      return response;
    },
    onSuccess: async (data, variables, context) => {
      //Refatch Data
      // console.log("RefetchData", data, variables, context);
      queryClient.setQueryData(["cables", id], data);
    },
  });

  if (
    cableQuery.isError ||
    lieferanten.isError ||
    terminationContainerList.isError
  ) {
    return <p>Error, could not load form.</p>;
  }

  if (
    cableQuery.isLoading ||
    lieferanten.isLoading ||
    terminationContainerList.isLoading
  ) {
    return <p>Loading...</p>;
  }

  // Since we have checked loading & error states, we know data is valid
  // const { _class, comment, fiberCount } = cableQuery.data ?? {};

  return (
    <CableFormComponent
      // defaultValues={{ _class, comment, fiberCount: fiberCount ?? 0 }}
      defaultValues={cableQuery.data as CableFormValues}
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
        toast.success("Cable successfully updated!");
        navigate("/cables");
      }}
      isSubmitting={mutation.isPending}
      isEditForm={true}
    />
  );
}
