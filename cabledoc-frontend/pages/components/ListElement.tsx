interface Data {
  name?: string;
  content?: string | {};
  id?: number | string;
}
interface ActionProps {
  data: Data;
  localizeFunction: (data: any) => string;
}

export default function ListElement({ data, localizeFunction }: ActionProps) {
  function renderValue(value: any, depth: number = 0): JSX.Element {
    if (typeof value === "object" && value !== null) {
      return (
        <div>
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className={""}>
              <span className={"font-bold"}>{localizeFunction(key)}: </span>
              {renderValue(val, ++depth)}
            </div>
          ))}
        </div>
      );
    } else {
      return <span>{String(value)}</span>;
    }
  }

  return (
    <div className="text-sm font-medium leading-6 py-3 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0">
      <div className="text-sm font-medium leading-6">{data.name}</div>
      <div className="mt-1 text-sm leading-6 sm:col-span-3 sm:mt-0">
        {renderValue(data.content)}
      </div>
    </div>
  );
}
