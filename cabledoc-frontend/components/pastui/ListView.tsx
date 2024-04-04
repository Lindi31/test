import ListElement from "./ListElement";
import ListElementDisclosure from "./ListElementDisclosure";

interface ActionProps {
  data: any;
  hideFields?: string[];
  disclosure?: boolean;
  localizeFunction: (data: any) => string;
}

export default function ListView({
  data,
  hideFields,
  disclosure = false,
  localizeFunction,
}: ActionProps) {
  return (
    <>
      <div className="divide-y divide-gray-100 dark:divide-gray-600">
        {Object.entries(data).map(([key, value]) => {
          if (!hideFields?.includes(key) && value !== null && key !== null) {
            if (disclosure) {
              return (
                <ListElementDisclosure
                  data={{
                    name: localizeFunction(key),
                    content: localizeFunction(value),
                  }}
                  localizeFunction={localizeFunction}
                  key={key}
                />
              );
            } else {
              return (
                <ListElement
                  data={{
                    name: localizeFunction(key),
                    content: localizeFunction(value),
                  }}
                  localizeFunction={localizeFunction}
                  key={key}
                />
              );
            }
          } else {
            return null;
          }
        })}
      </div>
    </>
  );
}
