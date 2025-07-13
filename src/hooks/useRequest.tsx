import { useState } from "react";
import type { ApiResourceItem } from "../utils/utils";

export enum HTTPMethods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

type SendRequestOptions = {
  method: "GET" | "POST" | "DELETE" | "PATCH";
  resourceName: string;
  body?: object;
  id?: number;
};

export const useRequest = () => {
  const [data, setData] = useState<ApiResourceItem[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Starting at 1 to avoid generating an ID of 0, which can be a real server ID.
  const [tempIdCounter, setTempIdCounter] = useState<number>(1);

  const endpoint: string = "https://jsonplaceholder.typicode.com/";

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
  };

  const onDeleteItem = (idToDelete: number) => {
    setData((prevData) => {
      if (!prevData) {
        return null;
      }

      return prevData.filter((item) => item.id !== idToDelete);
    });
  };

  const sendRequest = async ({
    method,
    resourceName,
    body,
    id,
  }: SendRequestOptions) => {
    setLoading(true);

    try {
      if (method === HTTPMethods.GET) {
        const data = await fetch(`${endpoint}${resourceName}`).then(
          (response) => response.json()
        );

        if (data) {
          setData(data);
        }
      }

      if (method === HTTPMethods.POST) {
        const post = await fetch(`${endpoint}${resourceName}`, {
          body: JSON.stringify(body),
          headers,
          method: HTTPMethods.POST,
        });

        if (data) {
          const newPost = await post.json();

          // The JSON Placeholder API returns an ID with the same value (201) for every POST made
          // So, it was necessary to create an unique client-side ID to manage UI state correctly
          // Using a negative counter avoids clashes with real IDs from GET
          const uniqueClientPost = {
            ...newPost,
            id: -tempIdCounter,
          };

          setTempIdCounter((prevCounter) => prevCounter + 1);
          setData([uniqueClientPost as ApiResourceItem, ...data]);
        }
      }

      if (method === HTTPMethods.DELETE) {
        const response = await fetch(`${endpoint}${resourceName}/${id}`, {
          method: HTTPMethods.DELETE,
        });

        if (response.ok) {
          onDeleteItem(id!);
        }
      }

      if (method === HTTPMethods.PATCH) {
        const updatedItem = await fetch(`${endpoint}${resourceName}/${id}`, {
          body: JSON.stringify(body),
          headers,
          method: HTTPMethods.PATCH,
        }).then((response) => response.json());

        if (updatedItem) {
          setData((prevData) => {
            if (!prevData) {
              return null;
            }

            return prevData.map((item) =>
              item.id === id ? { ...item, ...updatedItem } : item
            );
          });
        }
      }
    } catch (error) {
      console.error(`Request error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    sendRequest,
    setData,
  };
};

export default useRequest;
