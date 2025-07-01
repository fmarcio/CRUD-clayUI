import { useState } from "react";
import type { ApiResourceItem } from "../utils/utils";

enum HTTPMethods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

type SendRequestOptions = {
  method: "GET" | "POST" | "DELETE" | "PUT";
  resourceName: string;
  body?: object;
  id?: number;
};

export const useRequest = () => {
  const [data, setData] = useState<ApiResourceItem[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempIdCounter, setTempIdCounter] = useState<number>(0);

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
          // Using a negative, incrementing counter avoids clashes with real IDs from GET

          const uniqueClientPost = {
            ...newPost,
            id: -tempIdCounter + 1,
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

      if (method === HTTPMethods.PUT) {
        const data = await fetch(`${endpoint}${resourceName}/${id}`, {
          body: JSON.stringify({ ...body }),
          headers,
          method: HTTPMethods.PUT,
        }).then((response) => response.json());

        if (data) {
          setData(data);
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
