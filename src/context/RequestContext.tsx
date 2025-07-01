import { createContext } from "react";
import type useRequest from "../hooks/useRequest";

export type RequestContextType = ReturnType<typeof useRequest>;

export const RequestContext = createContext<RequestContextType | null>(null);
