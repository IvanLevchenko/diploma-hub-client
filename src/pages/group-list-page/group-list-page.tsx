import { useContext, useEffect, useState } from "react";
import { Button, Confirm, Container } from "semantic-ui-react";
import { AxiosError, AxiosResponse } from "axios";
import {
  GroupCreateDto,
  GroupUpdateDto,
} from "../../../shared-types/dto/group";
import { Group } from "../../../shared-types/entities/group";

import GroupBlock from "./group-block/group-block";
import ErrorMessage from "../../components/error-message/error-message";
import GroupModal from "./group-modal/group-modal";
import { ErrorMap } from "../../calls/interfaces/error-map";
import LsiContext from "../../lsi/lsi-context";

import Calls from "../../calls/calls";
import Lsi from "./lsi";
import "./group-list-page.scss";

function GroupListPage(): JSX.Element {
  const { lang } = useContext(LsiContext);
  const [groups, setGroups] = useState<Group[]>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [groupModal, setGroupModal] = useState<boolean>();
  const [groupUpdateData, setGroupUpdateData] = useState<{
    name: string;
    id: string;
  }>();
  const [deleteModal, setDeleteModal] = useState<boolean>();
  const [deleteGroupId, setDeleteGroupId] = useState<string>();

  useEffect(() => {
    Calls.group
      .list({})
      .then((response: AxiosResponse<Group[]>) => setGroups(response.data))
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }, []);

  function handleClose() {
    setErrorMessage("");
  }

  function handleCreateGroupModal() {
    setGroupModal(!groupModal);
    setGroupUpdateData(undefined);
  }

  function handleCreateGroup(payload: GroupCreateDto) {
    Calls.group
      .create(payload)
      .then(() => {
        location.reload();
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  function handleDeleteGroupModal(id?: string) {
    setDeleteModal(!deleteModal);

    if (id) {
      setDeleteGroupId(id);
    }
  }

  function handleDeleteGroup() {
    Calls.group
      .delete({ id: `${deleteGroupId}` })
      .then(() => {
        location.reload();
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  function handleChangeGroup(id: string, name: string) {
    setGroupUpdateData({
      id,
      name,
    });
    setGroupModal(!groupModal);
  }

  function handleUpdate(dto: GroupUpdateDto) {
    Calls.group
      .update(dto)
      .then(() => {
        location.reload();
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  return (
    <Container className="groups-page">
      <div className="groups-page__button">
        <Button onClick={handleCreateGroupModal}>
          {Lsi.createGroupButton[lang]}
        </Button>
      </div>
      <div className="groups-page-groups">
        {groups?.map((group) => (
          <GroupBlock
            key={group.id}
            id={group.id}
            authorId={group.authorId}
            users={group.userIdList.length}
            name={group.name}
            onDelete={handleDeleteGroupModal}
            onChange={handleChangeGroup}
          />
        ))}
      </div>
      {groupModal && (
        <GroupModal
          onClose={handleCreateGroupModal}
          onSubmit={handleCreateGroup}
          onUpdate={handleUpdate}
          mode={groupUpdateData?.id ? "update" : "create"}
          id={`${groupUpdateData?.id}`}
          name={groupUpdateData?.name}
        />
      )}
      {deleteModal && (
        <Confirm
          header={Lsi.deleteHeader[lang]}
          content={Lsi.deleteContent[lang]}
          confirmButton={Lsi.confirmButton[lang]}
          cancelButton={Lsi.cancelButton[lang]}
          onCancel={() => handleDeleteGroupModal()}
          onConfirm={handleDeleteGroup}
          centered={false}
          open
        />
      )}
      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={handleClose} />
      )}
    </Container>
  );
}

export default GroupListPage;
