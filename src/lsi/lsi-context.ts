import { createContext, Dispatch, SetStateAction } from "react";

import { Language } from "../types/language";

const LsiContext = createContext<{
  lang: Language;
  setLang: Dispatch<SetStateAction<Language>>;
}>({
  lang: "ua",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLang: () => {},
});

export default LsiContext;
