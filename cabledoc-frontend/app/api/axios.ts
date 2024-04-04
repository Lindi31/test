import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponseHeaders,
} from "axios";
import { User } from "./user";

const debugApi = process.env.NEXT_PUBLIC_DEBUG_API;
if (debugApi === "true") {
  axios.interceptors.request.use((request) => {
    console.log("Starting Request", JSON.stringify(request, null, 2));
    return request;
  });
  axios.interceptors.response.use((response) => {
    console.log("Response:", JSON.stringify(response, null, 2));
    return response;
  });
}

/** Remove Authorization header value from Axios error response
 * Or you can keep the 401, and not return the WWW-Authenticate header, which is really what the browser is responding to with the authentication popup. If the WWW-Authenticate header is missing, then the browser won't prompt for credentials.
 * https://syntaxfix.com/question/27815/how-to-prevent-browser-to-invoke-basic-auth-popup-and-handle-401-error-using-jquery
 */
// axios.interceptors.response.use(null, (error) => {
//   delete error.config.headers.Authorization;
//   delete error.request._header;
//   return Promise.reject(error); // ensure the promise chain keeps failing
// });
export type AxiosReturnType = {
  type: "success" | "error" | "unknown";
  data?: any;
  error?: AxiosError | Error;
};

function getHeader(user: User): AxiosRequestConfig {
  // Define default headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  // Prepare the auth object only if both username and password are available
  const auth = {
    username: "Isa",
    password: "testpass",
  };

  // Return the configuration object, conditionally including auth if defined
  const config: AxiosRequestConfig = {
    headers,
    ...(auth && { auth }), // Spread the auth object only if it's defined
  };

  return config;
}

//GET
export async function apiGetCall(user: User, path: string) {
  try {
    let result = await axios.get(path, getHeader(user));
    return result.data;
  } catch (error) {
    throw handleCustomError(error);
  }
  // let result = await axios
  //   .get(path, header)
  //   .then((response) => {
  //     return { type: "success", data: response.data };
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     return { type: "error", error, data: "" };
  //   });
  // return result;
}
//POST
export async function apiPostCall(
  user: User,
  path: string,
  body: number[] | {}
) {
  try {
    let result = await axios.post(path, body, getHeader(user));
    return result.data;
  } catch (error) {
    throw handleCustomError(error);
  }
}

//PUT
export async function apiPutCall(
  user: User,
  path: string,
  body: number[] | {}
) {
  // let result = await axios
  //   .put(path, body, getHeader(user))
  //   .then((response) => {
  //     return { type: "success", data: response.data };
  //   })
  //   .catch((error) => {
  //     return { type: "error", error, data: null };
  //   });
  // return result;
  try {
    let result = await axios.put(path, body, getHeader(user));
    return result.data;
  } catch (error) {
    throw handleCustomError(error);
  }
}

//Patch
export async function apiPatchCall(
  user: User,
  path: string,
  body: number[] | {}
) {
  // let result = await axios
  //   .patch(path, body, getHeader(user))
  //   .then((response) => {
  //     return { type: "success", data: response.data };
  //   })
  //   .catch((error) => {
  //     return { type: "error", error, data: null };
  //   });
  // return result;
  try {
    let result = await axios.patch(path, body, getHeader(user));
    return result.data;
  } catch (error) {
    throw handleCustomError(error);
  }
}

//DELETE
export async function apiDeleteCall(user: User, path: string) {
  try {
    let result = await axios.delete(path, getHeader(user));
    return result.data;
  } catch (error) {
    throw handleCustomError(error);
  }
  // let result = await axios
  //   .delete(path, getHeader(user))
  //   .then((response) => {
  //     return { type: "success", data: response.data };
  //   })
  //   .catch((error) => {
  //     return { type: "error", error, data: null };
  //   });
  // return result;
}

//ERROR Handling
/**
 * Logs the error to the Console and throws the Error
 * @param error
 */
function handleCustomError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Server responded with status code", error.response.status);
      console.log(error.response.data);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("The request was made but no response was received");
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error in setting up the request:", error.message);
    }
  } else {
    // it was some other kind of error, handle it appropriately
    if (error instanceof Error) {
      console.log("Unknown error:", error.message);
    }
  }

  throw error;
}
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}
export function axiosErrorHandler(error: unknown): string {
  let errorMessage = "An error occurred";

  if (isAxiosError(error)) {
    // Now TypeScript knows `error` is of type AxiosError
    const status = error?.response?.status;
    const errorDetails = error.message;
    errorMessage += ` - Status: ${status}, Error: ${errorDetails}`;
  } else if (error instanceof Error) {
    // Handle non-Axios errors
    errorMessage += ` - Error: ${error.message}`;
  }

  console.error(errorMessage);
  return errorMessage;
}

interface ErrorResponse {
  timestamp?: number;
  error?: string;
  message?: string;
  headers?: AxiosResponseHeaders;
}
export function getReadableError(error: any | AxiosError): string[] {
  let errorMessage: string[] = [];
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError;
    const status = String(err?.response?.status);
    errorMessage.push(status);
    errorMessage.push(err.message);

    if (err.response) {
      errorMessage.push(
        `Server responded with status code: ${err.response.status}`
      );
      if (err.response?.data) {
        const errorResponse: ErrorResponse = err.response.data;

        if (errorResponse.timestamp) {
          let date = new Date(errorResponse.timestamp);
          errorMessage.push(String(date));
        }
        if (errorResponse.error) {
          errorMessage.push(errorResponse.error);
        }

        if (errorResponse.message) {
          errorMessage.push(errorResponse.message);
        }
      }
      if (err.response?.headers) {
        //   const errorHeader: ErrorResponse = err.response.headers;
        //   errorMessage.push(errorHeader.headers);
      }
    } else if (err.request) {
      errorMessage.push("The request was made but no response was received");
      errorMessage.push(err.request);
    } else {
      errorMessage.push("Error in setting up the request:");
      errorMessage.push(err.message);
    }
  }
  // let message = errorMessage.join("\n") as string;
  return errorMessage;
}
