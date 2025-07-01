import React from "react";
import useRequest from "../hooks/useRequest";
import { RequestContext } from "../context/RequestContext";

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const request = useRequest();

  return (
    <RequestContext.Provider value={request}>
      {children}
    </RequestContext.Provider>
  );
};
