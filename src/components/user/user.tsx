import { Button, Confirm, Dropdown, Select } from "semantic-ui-react";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import * as React from "react";
import { useContext, useState } from "react";
import { Icon } from "@mdi/react";
import { mdiDotsVertical } from "@mdi/js";
import { AxiosError, AxiosResponse } from "axios";
import { PublicUser } from "../../../shared-types/types/public-user";
import { Group } from "../../../shared-types/entities/group";
import { UserCastToRoleDto } from "../../../shared-types/dto/user";

import { UserRoles } from "../../enums/user-roles";
import LsiContext from "../../lsi/lsi-context";
import SessionContext from "../../hocs/private-route/session-context";
import { ErrorMap } from "../../calls/interfaces/error-map";
import RoleModal from "./role-modal/role-modal";
import ErrorMessage from "../error-message/error-message";

import Calls from "../../calls/calls";
import Lsi from "./lsi";
import "./user.scss";

interface Props {
  user: PublicUser;
  onRemove?: (id: string) => void;
  onAddToGroup?: (id: string, userIdList: string[]) => void;
}

function User(props: Props): JSX.Element {
  const { lang } = useContext(LsiContext);
  const session = useContext(SessionContext);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [removeFromGroupModal, setRemoveFromGroupModal] = useState<boolean>();
  const [addToGroupModal, setAddToGroupModal] = useState<boolean>();
  const [groups, setGroups] = useState<Group[]>();
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [roleModal, setRoleModal] = useState<boolean>();

  function handleCloseError() {
    setErrorMessage("");
  }

  function handleRemoveFromGroup() {
    if (props.onRemove) {
      props.onRemove(props.user.id);
    }
  }

  function handleRemoveFromGroupModal() {
    setRemoveFromGroupModal(!removeFromGroupModal);
  }

  function handleAddToGroup() {
    if (props.onAddToGroup && selectedGroup) {
      props.onAddToGroup(selectedGroup, [props.user.id]);
    }
  }

  function handleAddToGroupModal() {
    setAddToGroupModal(!addToGroupModal);

    Calls.group
      .list({})
      .then((response: AxiosResponse<Group[]>) => {
        setGroups(response.data);
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  function handleChangeGroups(
    _: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    setSelectedGroup(`${data.value}`);
  }

  function handleRoleModal() {
    setRoleModal(!roleModal);
  }

  function handleCastToRole(payload: UserCastToRoleDto) {
    Calls.user
      .castToRole(payload)
      .then(() => {
        location.reload();
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  return (
    <div className="user">
      <b className="user__name separator">{`${props.user.firstName} ${props.user.lastName}`}</b>
      <p className="user__email separator">{props.user.email}</p>
      <b className="user__role separator">{props.user.role}</b>
      <p className="user__id separator">{props.user.id}</p>
      <b className="user__group">{props.user.group?.name || "-"}</b>
      <Dropdown
        icon="none"
        className="user__menu"
        trigger={
          <Icon
            path={mdiDotsVertical}
            color="grey"
            className="user__menu-icon"
          />
        }
      >
        <Dropdown.Menu>
          {props.onRemove ? (
            <Dropdown.Item onClick={handleRemoveFromGroupModal}>
              {Lsi.delete[lang]}
            </Dropdown.Item>
          ) : (
            <></>
          )}
          {props.onAddToGroup ? (
            <Dropdown.Item
              disabled={!!props.user.groupId}
              onClick={handleAddToGroupModal}
            >
              {Lsi.addToGroup[lang]}
            </Dropdown.Item>
          ) : (
            <></>
          )}
          {session?.role === UserRoles.TEACHER ||
          (session?.role === UserRoles.ADMIN &&
            session?.id !== props.user.id) ? (
            <Dropdown.Item onClick={handleRoleModal}>
              {Lsi.castToRole[lang]}
            </Dropdown.Item>
          ) : (
            <></>
          )}
        </Dropdown.Menu>
      </Dropdown>
      {removeFromGroupModal && (
        <Confirm
          open
          centered={false}
          onCancel={handleRemoveFromGroupModal}
          onConfirm={handleRemoveFromGroup}
          header={Lsi.deleteFromGroupHeader[lang]}
          content={Lsi.deleteFromGroupDescription[lang]}
          confirmButton={Lsi.confirmButton[lang]}
          cancelButton={Lsi.cancelButton[lang]}
        />
      )}
      {addToGroupModal && groups && (
        <Confirm
          open
          centered={false}
          onCancel={handleAddToGroupModal}
          onConfirm={handleAddToGroup}
          header={Lsi.deleteFromGroupHeader[lang]}
          content={
            <div className="select-modal">
              <Select
                onChange={handleChangeGroups}
                className="select-modal__select"
                options={groups.map((group) => ({
                  text: group.name,
                  value: group.id,
                }))}
              />
            </div>
          }
          confirmButton={
            <Button disabled={!selectedGroup}>{Lsi.confirmButton[lang]}</Button>
          }
          cancelButton={Lsi.cancelButton[lang]}
        />
      )}
      {roleModal && (
        <RoleModal
          onSubmit={handleCastToRole}
          onClose={handleRoleModal}
          id={props.user.id}
        />
      )}
      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={handleCloseError} />
      )}
    </div>
  );
}

export default User;
