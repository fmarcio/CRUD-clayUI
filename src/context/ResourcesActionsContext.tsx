import { createContext } from "react";
import { HTTPMethods } from "../hooks/useRequest";

export type ResourcesActionsContextType = {
  // TODO: if necessary, add more handleActions functions for other resources (photos, albums, users, etc...)

  handleTodoActions: ({
    id,
    method,
    body,
  }: {
    id?: number;
    method: HTTPMethods;
    body?: object;
  }) => Promise<void>;
};

export const ResourcesActionsContext =
  createContext<ResourcesActionsContextType | null>(null);
