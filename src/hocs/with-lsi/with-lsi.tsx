import React, { useState } from "react";

import LsiContext from "../../lsi/lsi-context";
import { Language } from "../../types/language";

interface Props {
  children: React.ReactNode;
}

function WithLsi(props: Props) {
  const [lang, setLang] = useState<Language>("ua");

  return (
    <LsiContext.Provider value={{ lang, setLang }}>
      {props.children}
    </LsiContext.Provider>
  );
}

export default WithLsi;
