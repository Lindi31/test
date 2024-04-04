import { useMutation } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { removeEmptyValues } from "../../ressources/functions";
import { User } from "../../../app/api/user";
import toast from "react-hot-toast";
import { getReadableError } from "../../../app/api/axios";
import { getTerminationContainerListQuery } from "../../model/Location";
import { ConnectionFormValues, addConnection } from "../../model/Connection";
import ConnectionFormComponent from "./ConnectionFormComponent";

export default function ConnectionFechterAdd({
  setError,
}: {
  setError?: (error: string[]) => void;
}) {
  const user: User = useOutletContext();
  const navigate = useNavigate();

  const terminationContainerList = getTerminationContainerListQuery(user);

  const mutation = useMutation({
    mutationFn: (data: ConnectionFormValues) => {
      const modifiedData = removeEmptyValues({
        ...data,
      });
      // console.log(modifiedData);
      return addConnection(user, modifiedData);
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

  if (terminationContainerList.isError) {
    return <p>Error, could not load form.</p>;
  }

  if (terminationContainerList.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ConnectionFormComponent
        defaultValues={{
          fiberCount: 2,
          terminationsMap: [],
          start: null,
          end: null,
          status: "OFFEN",
          type: "LWL",
          comment: "",
          version: null,
        }}
        optionLists={{
          terminationContainerList: terminationContainerList.data as {
            name: string;
            id: string;
          }[],
        }}
        onSubmit={async (data: {
          // id?: number | null | undefined;
          fiberCount?: number | null | undefined;
          terminationsMap?: [number, number][][] | null | undefined;
          start?: number | null | undefined;
          end?: number | null | undefined;
          status?: string | null | undefined;
          type?: string | null | undefined;
          comment?: string | null | undefined;
          // version?: number | null | undefined;
        }) => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }

          console.log(data);
          // throw new Error("");

          try {
            if (setError) setError([]);
            const response = await mutation.mutateAsync(data);
            console.log(response);
          } catch (error) {
            if (setError) setError(getReadableError(error));
            throw error;
          }

          toast.success("Connection successfully added!");
          // navigate("/connections");
        }}
        isSubmitting={mutation.isPending}
      />
    </>
  );
}
