import { useState } from "react";
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

/* 
  useRequest does not manage data state. 
  It will receive setData function as an arg to update the state in ResourcesProvider
 */

export const useRequest = (
  setData: React.Dispatch<React.SetStateAction<ApiResourceItem[]>>
) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Starting at 1 to avoid generating an ID of 0, which can be a real server ID.
  const [tempIdCounter, setTempIdCounter] = useState<number>(1);

  const endpoint: string = "https://jsonplaceholder.typicode.com/";

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
  };

  const onDeleteItem = (idToDelete: number) => {
    setData((prevData) => prevData.filter((item) => item.id !== idToDelete));
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

        const newPost = await post.json();

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
          setData((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, ...updatedItem } : item
            )
          );
        }
      }
    } catch (error) {
      console.error(`Request error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendRequest,
  };
};

export default useRequest;
