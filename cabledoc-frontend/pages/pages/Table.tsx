export default function Table({ data }: { data: any }) {
  if (!Array.isArray(data)) {
    return <div>The data is not an Array</div>;
  }

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Rechte
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, i: number) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-bold text-emerald-600"
                >
                  {String(item.name)}
                </th>
                <td className="px-6 py-4">{String(item.username)}</td>
                <td className="px-6 py-4">
                  {item.allRights?.join(", ") || "Keine Rechte"}
                </td>
                <td className="px-6 py-4">Actions</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
