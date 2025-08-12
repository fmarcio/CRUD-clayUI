import { useContext } from "react";
import { ResourcesContext } from "../context/ResourcesContext";

export const useResourcesContext = () => {
  const context = useContext(ResourcesContext);

  if (!context) {
    throw new Error(
      "useResourcesContext must be used within an ResourcesProvider"
    );
  }
  return context;
};
