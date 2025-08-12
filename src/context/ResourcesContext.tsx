import { createContext } from "react";
import type { SendRequestOptions } from "../hooks/useRequest";
import type { ApiResourceItem } from "../utils/utils";

interface IResourcesContext {
  data: ApiResourceItem[];
  loading: boolean;
  selectedResource: string;
  sendRequest: (args: SendRequestOptions) => Promise<void>;
  setData: (data: ApiResourceItem[]) => void;
  setSelectedResource: (item: string) => void;
}

export const ResourcesContext = createContext<IResourcesContext | null>(null);
