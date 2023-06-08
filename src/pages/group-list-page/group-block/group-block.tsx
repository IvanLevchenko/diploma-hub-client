import { Icon } from "@mdi/react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";
import { mdiAccount, mdiDotsVertical } from "@mdi/js";
import { useContext } from "react";

import LsiContext from "../../../lsi/lsi-context";
import SessionContext from "../../../hocs/private-route/session-context";
import { UserRoles } from "../../../enums/user-roles";

import Lsi from "./lsi";
import "./group-block.scss";

interface Props {
  id: string;
  authorId: string;
  users: number;
  name: string;
  onDelete: (id: string) => void;
  onChange: (id: string, name: string) => void;
}

function GroupBlock(props: Props): JSX.Element {
  const navigate = useNavigate();
  const { lang } = useContext(LsiContext);
  const session = useContext(SessionContext);

  function handleRedirect() {
    navigate(`/group?id=${props.id}`);
  }

  function handleDelete() {
    props.onDelete(props.id);
  }

  function handleChange() {
    props.onChange(props.id, props.name);
  }

  return (
    <div className="groups-page__group" onClick={handleRedirect}>
      <p className="groups-page__group-name">{props.name}</p>
      <p className="groups-page__group-users">
        <Icon path={mdiAccount} size="15" />
        {props.users}
      </p>
      <Dropdown
        icon="none"
        className="groups-page__group-dropdown"
        trigger={
          <Icon
            className="groups-page__group-dropdown-icon"
            path={mdiDotsVertical}
            color="grey"
          />
        }
      >
        <Dropdown.Menu>
          <Dropdown.Item
            disabled={session?.role === UserRoles.STUDENT}
            onClick={handleDelete}
          >
            {Lsi.delete[lang]}
          </Dropdown.Item>
          <Dropdown.Item
            disabled={session?.id !== props.authorId}
            onClick={handleChange}
          >
            {Lsi.changeName[lang]}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default GroupBlock;
