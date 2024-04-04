import React from "react";
import Callout from "./Callout";
interface ErrorWrapperProps {
  error: string[];
  width?: string;
}

export default function ErrorWrapper({ error, width }: ErrorWrapperProps) {
  return (
    <>
      {error.length !== 0 && (
        <Callout className={width} data={{ type: "error", heading: true }}>
          <div>Es sind folgende Fehler aufgetreten:</div>
          <ul>
            {/* Use map to loop through the error array and generate <span> elements */}
            {error.map((errorMessage, index) => (
              <React.Fragment key={index}>
                <li className="list-disc mx-5 text-sm">{errorMessage}</li>
              </React.Fragment>
            ))}
          </ul>
        </Callout>
      )}
    </>
  );
}
