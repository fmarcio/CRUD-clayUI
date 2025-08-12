import React, { useState, useMemo, type ReactNode } from "react";
import { useRequest } from "../../hooks/useRequest";
import { type ApiResourceItem } from "../../utils/utils";
import { ResourcesContext } from "../../context/ResourcesContext";

export const ResourcesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<ApiResourceItem[]>([]);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const { loading, sendRequest } = useRequest(setData);

  const value = useMemo(
    () => ({
      data,
      loading,
      selectedResource,
      sendRequest,
      setData,
      setSelectedResource,
    }),
    [data, loading, selectedResource, sendRequest]
  );

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
};
