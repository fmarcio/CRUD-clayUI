import { useState, useCallback } from "react";
import type { ApiResourceItem } from "../utils/utils";

export enum HTTPMethods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type SendRequestOptions = {
  method:
    | HTTPMethods.GET
    | HTTPMethods.POST
    | HTTPMethods.DELETE
    | HTTPMethods.PATCH;
  resourceName: string;
  body?: object;
  id?: number;
};

export const useRequest = () => {
  const [data, setData] = useState<ApiResourceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Starting at 1 to avoid generating an ID of 0, which can be a real server ID.
  const [tempIdCounter, setTempIdCounter] = useState<number>(1);

  const endpoint: string = "https://jsonplaceholder.typicode.com/";

  const sendRequest = useCallback(
    async ({ method, resourceName, body, id }: SendRequestOptions) => {
      setLoading(true);
      setError(null);

      try {
        const url = id
          ? `${endpoint}${resourceName}/${id}`
          : `${endpoint}${resourceName}`;

        const response = await fetch(url, {
          method,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        switch (method) {
          case HTTPMethods.GET: {
            const result = await response.json();
            setData(result);
            break;
          }
          case HTTPMethods.POST: {
            const newPost = await response.json();

            // The JSON Placeholder API returns an ID with the same value (201) for every POST made
            // So, it was necessary to create an unique client-side ID to manage UI state correctly
            // Using a negative counter avoids clashes with real IDs from GET

            const uniqueClientPost = {
              ...newPost,
              id: -tempIdCounter,
            };

            setTempIdCounter((prevCounter) => prevCounter + 1);

            setData((prevData) => [
              uniqueClientPost as ApiResourceItem,
              ...prevData,
            ]);
            break;
          }
          case HTTPMethods.PATCH: {
            const updatedItem = await response.json();

            setData((prevData) =>
              prevData.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
              )
            );

            break;
          }
          case HTTPMethods.DELETE: {
            setData((prevData) => prevData.filter((item) => item.id !== id));

            break;
          }
        }
      } catch (error: any) {
        setError(error);
        console.error("Request failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [tempIdCounter]
  );

  return {
    data,
    setData,
    loading,
    error,
    sendRequest,
  };
};

export default useRequest;
