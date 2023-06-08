import * as React from "react";
import { useContext, useState } from "react";
import { Button, Modal, Select } from "semantic-ui-react";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import { UserCastToRoleDto } from "../../../../shared-types/dto/user";

import { UserRoles } from "../../../enums/user-roles";
import LsiContext from "../../../lsi/lsi-context";

import Lsi from "./lsi";
import "./role-modal.scss";

interface Props {
  onClose: () => void;
  onSubmit: (payload: UserCastToRoleDto) => void;
  id: string;
}

function RoleModal(props: Props): JSX.Element {
  const { lang } = useContext(LsiContext);
  const [payload, setPayload] = useState<UserCastToRoleDto>();

  const userRolesList = Object.values(UserRoles).map((role) => ({
    value: role,
    text: role,
  }));

  function handleChange(
    _: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    const role = `${data.value}` as UserRoles;
    setPayload({ role, id: props.id });
  }

  function handleSubmit() {
    if (payload) {
      props.onSubmit(payload);
    }
  }

  return (
    <Modal centered={false} onClose={props.onClose} className="role-modal" open>
      <Modal.Header>{Lsi.header[lang]}</Modal.Header>
      <Modal.Content>
        <Select
          options={userRolesList}
          placeholder={Lsi.placeholder[lang]}
          className="role-modal__role-selection"
          name="role-select"
          onChange={handleChange}
        />
      </Modal.Content>
      <div className="role-modal__buttons">
        <Button onClick={props.onClose}>{Lsi.cancelButton[lang]}</Button>
        <Button color="blue" onClick={handleSubmit}>
          {Lsi.createButton[lang]}
        </Button>
      </div>
    </Modal>
  );
}

export default RoleModal;
