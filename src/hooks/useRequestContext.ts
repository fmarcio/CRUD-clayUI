import { useContext } from "react";
import { RequestContext } from "../context/RequestContext";

export const useRequestContext = () => {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error("useRequestContext must be used within a RequestProvider");
  }
  return context;
};
