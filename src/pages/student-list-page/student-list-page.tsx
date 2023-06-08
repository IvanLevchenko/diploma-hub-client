import { Container } from "semantic-ui-react";
import { useContext, useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { PublicUser } from "../../../shared-types/types/public-user";

import User from "../../components/user/user";
import LsiContext from "../../lsi/lsi-context";
import ErrorMessage from "../../components/error-message/error-message";
import { ErrorMap } from "../../calls/interfaces/error-map";

import Calls from "../../calls/calls";
import Lsi from "./lsi";
import "./student-list-page.scss";

function StudentListPage() {
  const [users, setUsers] = useState<PublicUser[]>();
  const { lang } = useContext(LsiContext);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    Calls.user
      .list({})
      .then((response: AxiosResponse<PublicUser[]>) => {
        setUsers(response.data);
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }, []);

  function handleAddToGroup(id: string, userIdList: string[]) {
    Calls.group
      .addUsers({ groupId: id, userIdList })
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

  return (
    <Container>
      <h2>{Lsi.students[lang]}</h2>
      <div className="students-list__user-list">
        {users?.length ? (
          users?.map((user) => (
            <User user={user} onAddToGroup={handleAddToGroup} key={user.id} />
          ))
        ) : (
          <></>
        )}
      </div>
      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={handleCloseError} />
      )}
    </Container>
  );
}

export default StudentListPage;
