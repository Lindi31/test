import { useEffect, useState } from "react";
import {
  cardHeaderColorSecondary,
  cardStyleInner,
  tableLayout,
  tableStyle,
  tfootStyle,
  theadStyleBlue,
} from "../../components/Layout/tailwindStyles";
import { Cable, Fiber, getFibers } from "../../model/Cable";
import { useOutletContext } from "react-router-dom";
import { User } from "../../../app/api/user";

export default function CableFibers({ cable }: { cable: Cable }) {
  // @ts-ignore
  const [fibers, setFibers] = useState<Fiber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user: User = useOutletContext();

  useEffect(() => {
    const fetch = async () => {
      if (!cable.fibers) {
        return;
      }
      setLoading(true);
      // cable.fibers.sort((n1, n2) => Number(n1) - Number(n2));
      const fibers = await getFibers(user, cable.fibers as Fiber[]);
      fibers.sort(
        (n1: { fiberNo: any }, n2: { fiberNo: any }) =>
          Number(n1.fiberNo) - Number(n2.fiberNo)
      );
      setFibers(fibers);
      setLoading(false);
    };

    fetch();
  }, []);

  if (!fibers) {
    return <div>No fibers found...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  const layout = "pl-3 pt-3";

  return (
    <>
      <div className={"text-left " + cardStyleInner}>
        <div
          className={`${layout} ${cardHeaderColorSecondary} pb-1 rounded-t-lg text-white`}
        >
          <h3 className={"text-base font-bold leading-7"}>{"Fasern"}</h3>
          <p
            className="mt-1 
           text-sm leading-6 text-white-400"
          >
            Faserbelegung
          </p>
        </div>
        <div
          className={
            layout + " mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"
          }
        >
          {fibers && (
            <>
              <div className="overflow-x-auto rounded-lg pr-3 pb-3">
                <table className="w-full text-sm text-left border rounded border-collapse">
                  <thead
                    className={theadStyleBlue + " border-b border-b-gray-300"}
                  >
                    <tr className={""}>
                      <th
                        className={
                          tableLayout +
                          " " +
                          "py-2 border-b-2 dark:border-gray-500"
                        }
                      >
                        Faser
                      </th>
                      <th
                        className={
                          tableLayout +
                          " " +
                          "py-2 border-b-2 dark:border-gray-500"
                        }
                      >
                        Status
                      </th>
                      <th
                        className={
                          tableLayout +
                          " " +
                          "py-2 border-b-2 dark:border-gray-500"
                        }
                      >
                        Verbindung
                      </th>
                      <th
                        className={
                          tableLayout +
                          " " +
                          "py-2 border-b-2 dark:border-gray-500"
                        }
                      >
                        Reihenfolge
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`[&>*:nth-child(even)]:bg-blue-50  dark:[&>*:nth-child(even)]:bg-gray-600`}
                  >
                    {fibers.map((fiber, index) => (
                      <tr key={index} className={tableStyle}>
                        <td className={tableLayout}>{fiber.fiberNo}</td>
                        <td className={tableLayout}>{fiber.status}</td>
                        <td className={tableLayout}>{fiber.connectionId}</td>
                        <td className={tableLayout}>{fiber.sequence}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot
                    className={tfootStyle + " border-t-2 border-t-gray-300"}
                  ></tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
