import { Container, Loader } from "semantic-ui-react";
import { useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Group } from "../../../shared-types/entities/group";

import User from "../../components/user/user";
import LsiContext from "../../lsi/lsi-context";
import ErrorMessage from "../../components/error-message/error-message";
import { ErrorMap } from "../../calls/interfaces/error-map";

import Calls from "../../calls/calls";
import Lsi from "./lsi";
import "./group-page.scss";

function GroupPage(): JSX.Element {
  const { lang } = useContext(LsiContext);
  const [params] = useSearchParams();
  const [loader, setLoader] = useState<boolean>(true);
  const [group, setGroup] = useState<Group>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const id = params.get("id");

  useEffect(() => {
    Calls.group
      .get({ id: `${id}` })
      .then((response: AxiosResponse<Group>) => {
        setGroup(response.data);
        setLoader(false);
      })
      .catch((e) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }, []);

  function handleRemove(id: string) {
    Calls.group
      .removeUsers({ userIdList: [id], groupId: `${group?.id}` })
      .then(() => {
        location.reload();
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  function handleCloseError() {
    setErrorMessage("");
  }

  return loader ? (
    <Loader active />
  ) : (
    <Container>
      <h2>{`${Lsi.students[lang]} ${group?.name}`}</h2>
      {group?.userList.length ? (
        <div className="group-page__user-list">
          {group?.userList.map((user) => (
            <User user={user} onRemove={handleRemove} key={user.id} />
          ))}
        </div>
      ) : (
        <></>
      )}
      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={handleCloseError} />
      )}
    </Container>
  );
}

export default GroupPage;
