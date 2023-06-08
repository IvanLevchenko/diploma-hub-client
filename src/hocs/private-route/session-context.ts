import { createContext } from "react";
import { TokenPayload } from "../../../shared-types/types/token-payload";

const SessionContext = createContext<TokenPayload | undefined>(undefined);

export default SessionContext;
