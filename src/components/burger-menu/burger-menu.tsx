import { Link } from "react-router-dom";
import { Icon } from "@mdi/react";
import { mdiClose, mdiMenu } from "@mdi/js";
import { useContext, useState } from "react";

import LsiContext from "../../lsi/lsi-context";
import SessionContext from "../../hocs/private-route/session-context";
import { UserRoles } from "../../enums/user-roles";

import burgerMenuRoutes, {
  menuRoutesList,
} from "../../constants/burger-menu-routes";
import "./burger-menu.scss";

function BurgerMenu(): JSX.Element {
  const { lang } = useContext(LsiContext);
  const session = useContext(SessionContext);
  const [menuOpened, setMenuOpened] = useState<boolean>();

  function handleMenu() {
    setMenuOpened(!menuOpened);
  }

  function getRoute(menuRoute: menuRoutesList, index: number) {
    return (
      <Link
        key={menuRoute.route}
        to={menuRoute.route}
        className={`burger-menu__route ${
          index + 1 === burgerMenuRoutes.length ? "last" : ""
        }`}
        onClick={handleMenu}
      >
        {menuRoute.routeName[lang]}
      </Link>
    );
  }

  return (
    <div className="burger-menu">
      <span className="burger-menu__button" onClick={handleMenu}>
        <Icon path={mdiMenu} size="40" color="white" />
      </span>
      <div className={`burger-menu__menu ${menuOpened ? null : "hidden"}`}>
        <span className="burger-menu__close-button" onClick={handleMenu}>
          <Icon path={mdiClose} size="40" color="white" />
        </span>
        {burgerMenuRoutes.map((menuRoute, i) => {
          if (menuRoute.adminOnly) {
            if (
              session?.role === UserRoles.ADMIN ||
              session?.role === UserRoles.TEACHER
            ) {
              return getRoute(menuRoute, i);
            }
          } else {
            return getRoute(menuRoute, i);
          }
        })}
      </div>
      <div
        className={`burger-menu__menu-background ${
          menuOpened ? null : "hidden-background"
        }`}
        onClick={handleMenu}
      ></div>
    </div>
  );
}

export default BurgerMenu;
