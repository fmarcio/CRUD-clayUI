import { useReducer, useCallback } from "react";
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

interface State {
  data: ApiResourceItem[];
  loading: boolean;
  error: Error | null;
  tempIdCounter: number;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_ERROR"; payload: Error }
  | { type: "SET_DATA"; payload: ApiResourceItem[] }
  | { type: "GET_SUCCESS"; payload: ApiResourceItem[] }
  | { type: "POST_SUCCESS"; payload: ApiResourceItem }
  | { type: "PATCH_SUCCESS"; payload: { item: ApiResourceItem; id: number } }
  | { type: "DELETE_SUCCESS"; payload: number };

const initialState: State = {
  data: [],
  loading: false,
  error: null,
  // Starting at 1 to avoid generating an ID of 0, which can be a real server ID.
  tempIdCounter: 1,
};

const requestReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SET_DATA":
      return { ...state, data: action.payload };

    case "GET_SUCCESS":
      return { ...state, loading: false, data: action.payload };

    case "POST_SUCCESS":
      // The JSON Placeholder API returns an ID with the same value (201) for every POST made
      // So, it was necessary to create an unique client-side ID to manage UI state correctly
      // Using a negative counter avoids clashes with real IDs from GET

      const uniqueClientPost = {
        ...action.payload,
        id: -state.tempIdCounter,
      };

      return {
        ...state,
        loading: false,
        data: [uniqueClientPost, ...state.data],
        tempIdCounter: state.tempIdCounter + 1,
      };

    case "PATCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: state.data.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.item }
            : item
        ),
      };

    case "DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
        data: state.data.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
};

export const useRequest = () => {
  const [state, dispatch] = useReducer(requestReducer, initialState);

  const endpoint: string = "https://jsonplaceholder.typicode.com/";

  const sendRequest = useCallback(
    async ({ method, resourceName, body, id }: SendRequestOptions) => {
      dispatch({ type: "FETCH_START" });

      try {
        const url = id
          ? `${endpoint}${resourceName}/${id}`
          : `${endpoint}${resourceName}`;

        const options: RequestInit = {
          method,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        switch (method) {
          case HTTPMethods.GET: {
            const result = await response.json();

            dispatch({ type: "GET_SUCCESS", payload: result });

            break;
          }

          case HTTPMethods.POST: {
            const newPost = (await response.json()) as ApiResourceItem;

            const createdItem = { ...(body as object), ...newPost };

            dispatch({ type: "POST_SUCCESS", payload: createdItem });

            break;
          }

          case HTTPMethods.PATCH: {
            const updatedItem = (await response.json()) as ApiResourceItem;

            if (id) {
              dispatch({
                type: "PATCH_SUCCESS",
                payload: { item: updatedItem, id },
              });
            }

            break;
          }

          case HTTPMethods.DELETE: {
            if (id) {
              dispatch({ type: "DELETE_SUCCESS", payload: id });
            }

            break;
          }
        }
      } catch (error: any) {
        dispatch({ type: "FETCH_ERROR", payload: error });

        console.error("Request failed:", error);
      }
    },
    []
  );

  const setData = useCallback((data: ApiResourceItem[]) => {
    dispatch({ type: "SET_DATA", payload: data });
  }, []);

  return { ...state, sendRequest, setData };
};

export default useRequest;
