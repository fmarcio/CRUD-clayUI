import React from "react";
import { ResourcesActionsContext } from "../../context/ResourcesActionsContext";
import { useRequestContext } from "../../hooks/useRequestContext";
import { HTTPMethods } from "../../hooks/useRequest";

export const ResourcesActionsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { sendRequest } = useRequestContext();

  // function to keep code clean and avoid duplication

  const handleTodoActions = async ({
    id,
    method,
    body,
  }: {
    id?: number;
    method: HTTPMethods;
    body?: object;
  }) => {
    await sendRequest({
      body,
      id,
      method,
      resourceName: "todos",
    });
  };

  return (
    <ResourcesActionsContext.Provider value={{ handleTodoActions }}>
      {children}
    </ResourcesActionsContext.Provider>
  );
};
