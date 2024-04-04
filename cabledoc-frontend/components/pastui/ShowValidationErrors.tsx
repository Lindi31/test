import React from "react";

export interface ErrorData {
  [key: string]: Error[] | Error;
  //   Record<string, Error | Error[]>;
}

interface Error {
  message: string;
  type: string;
  ref?: any;
}

export function ShowValidationErrors({ errors }: ErrorData) {
  return (
    <>
      {errors && Object.keys(errors).length !== 0 && (
        <div className="text-stone-600 border-red-300 bg-red-100 rounded border-l-8 my-2 p-2 mr-2">
          <h1 className="text-xl text-red-500 font-bold">Validation Errors:</h1>
          {Object.keys(errors).map((errorKey) => {
            const error = errors[errorKey as keyof typeof errors] as
              | Error
              | Error[];
            if (Array.isArray(error)) {
              return (
                <div key={errorKey}>
                  <h2 className="text-base font-bold">{errorKey}:</h2>
                  {error.map((errorItem, index) => (
                    <React.Fragment key={index}>
                      {Array.isArray(errorItem) ? (
                        <div>
                          <p className="text-red-500 text-sm">
                            {errorItem.message}
                          </p>
                        </div>
                      ) : (
                        Object.keys(errorItem).map(
                          (propertyName, indexInner) => (
                            <p
                              key={indexInner}
                              className="text-red-500 text-sm"
                            >
                              <span className="text-red-800">
                                {propertyName}:
                              </span>
                              {errorItem[propertyName as keyof Error].message}
                            </p>
                          )
                        )
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            } else {
              return (
                <div key={errorKey}>
                  <h2 className="text-base font-bold">{errorKey}:</h2>
                  <p className="text-red-500 text-sm">{error.message}</p>
                </div>
              );
            }
          })}
        </div>
      )}
    </>
  );
}
