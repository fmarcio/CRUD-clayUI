import { useContext } from "react";
import { ResourcesActionsContext } from "../context/ResourcesActionsContext";

export const useResourcesActionsContext = () => {
  const context = useContext(ResourcesActionsContext);

  if (!context) {
    throw new Error(
      "useResourcesActionContext must be used within a ResourcesActionProvider"
    );
  }
  return context;
};
