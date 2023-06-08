import { useContext } from "react";
import { Dropdown, Header as HeaderComponent } from "semantic-ui-react";
import { mdiTranslate } from "@mdi/js";
import { Icon } from "@mdi/react";

import LsiContext from "../../lsi/lsi-context";
import BurgerMenu from "../burger-menu/burger-menu";
import { Language } from "../../types/language";

import "./header.scss";
import languages from "../../static/languages.json";

function Header() {
  const { lang, setLang } = useContext(LsiContext);

  return (
    <HeaderComponent className="header-wrapper">
      <BurgerMenu />
      <div className="header-wrapper__language">
        <Dropdown
          icon="none"
          trigger={
            <Icon
              path={mdiTranslate}
              className="header-wrapper__language-icon"
              color="white"
            />
          }
        >
          <Dropdown.Menu direction="left">
            {languages.map((language) => {
              const code = language.code as Language;
              return (
                <Dropdown.Item
                  key={language.code}
                  onClick={() => setLang(code)}
                  selected={code === lang}
                >
                  {language.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </HeaderComponent>
  );
}

export default Header;
