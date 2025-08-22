import React, { useState, useMemo, type ReactNode, useCallback } from "react";
import useRequest from "../../hooks/useRequest";
import { ResourcesContext } from "../../context/ResourcesContext";

export const ResourcesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data, loading, error, sendRequest, setData } = useRequest();
  const [selectedResource, setSelectedResource] = useState<string>("");

  const handleSetSelectedResource = useCallback(
    (resource: string) => {
      if (resource === "") {
        setData([]);
      }
      setSelectedResource(resource);
    },
    [setData]
  );

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      selectedResource,
      sendRequest,
      setData,
      setSelectedResource: handleSetSelectedResource,
    }),
    [
      data,
      loading,
      error,
      selectedResource,
      sendRequest,
      setData,
      handleSetSelectedResource,
    ]
  );

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
};
