import { Confirm, Container, Dropdown, Loader } from "semantic-ui-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { mdiAccount, mdiClockOutline, mdiDelete, mdiPlus } from "@mdi/js";
import { Icon } from "@mdi/react";
import { RepositoryWithAuthor } from "../../../shared-types/types/repository-with-author";

import { UserRoles } from "../../enums/user-roles";
import SessionContext from "../../hocs/private-route/session-context";
import LsiContext from "../../lsi/lsi-context";
import RepositoryFile from "./repository-file/repository-file";
import UploadFileForm from "./upload-file-form/upload-file-form";
import { ErrorMap } from "../../calls/interfaces/error-map";

import Lsi from "./lsi";
import Calls from "../../calls/calls";
import "./repository-page.scss";

function RepositoryPage() {
  const [loader, setLoader] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [repository, setRepository] = useState<RepositoryWithAuthor>();
  const [fileForm, setFileForm] = useState<boolean>();
  const [deleteModal, setDeleteModal] = useState<boolean>();
  const [params] = useSearchParams();
  const session = useContext(SessionContext);
  const { lang } = useContext(LsiContext);
  const navigate = useNavigate();

  const id = params.get("id");

  useEffect(() => {
    if (id) {
      Calls.repository
        .get({ id })
        .then((response: AxiosResponse<RepositoryWithAuthor>) => {
          setRepository(response.data);
          setLoader(false);
        })
        .catch((e: AxiosError) => {
          setLoader(false);
          const errorMap = e.response?.data as ErrorMap;
          setErrorMessage(errorMap.message);
        });
    }
  }, []);

  function handleOpenFile(id: string): void {
    Calls.file
      .get({ id })
      .then((response: AxiosResponse<Blob>) => {
        const blob = new Blob([response.data], {
          type: "application/pdf",
        });
        window.open(URL.createObjectURL(blob));
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  function handleFileForm() {
    setFileForm(!fileForm);
  }

  function handleDelete() {
    Calls.repository
      .delete({ id: `${id}` })
      .then(() => {
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleDeleteModal() {
    setDeleteModal(!deleteModal);
  }

  function handleRemoveErrorMessage() {
    setErrorMessage("");
  }

  function isAlreadyUploaded(): boolean {
    if (
      session?.role === UserRoles.ADMIN ||
      session?.role === UserRoles.TEACHER
    ) {
      return false;
    }
    return !!repository
      ? !!repository.filesList.find((file) => file.authorId === session?.id)
      : false;
  }

  return (
    <>
      <Container className="container">
        {repository ? (
          <div>
            <div>
              <h2>{repository.name}</h2>
              <p className="container__substring">
                <Icon path={mdiAccount} size="20" color="grey" title="Author" />
                {`${repository.author.firstName} ${repository.author.lastName}`}
                &nbsp;
                <Icon
                  path={mdiClockOutline}
                  size="20"
                  color="grey"
                  title="Creation date"
                />
                {new Date(repository.created).toLocaleDateString()}
              </p>
              <div className="container__dropdown-panel">
                <Dropdown
                  text={Lsi.menu[lang]}
                  className="container__dropdown-panel-dropdown"
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      className="container__dropdown-panel-dropdown-item"
                      disabled={isAlreadyUploaded()}
                      onClick={handleFileForm}
                    >
                      <Icon path={mdiPlus} size="20" />
                      {Lsi.create[lang]}
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="container__dropdown-panel-dropdown-item"
                      disabled={session?.role === UserRoles.STUDENT}
                      onClick={handleDeleteModal}
                    >
                      <Icon path={mdiDelete} size="20" />
                      {Lsi.deleteRepository[lang]}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="container__repository-list">
              {repository.filesList.map((file) => (
                <RepositoryFile
                  id={file.id}
                  key={file.id}
                  name={file.filename}
                  author={file.author}
                  filepath={file.filepath}
                  onOpen={handleOpenFile}
                />
              ))}
            </div>
            <Loader active={loader} />
          </div>
        ) : (
          <></>
        )}
        {fileForm && <UploadFileForm onClose={handleFileForm} open />}
        <Confirm
          cancelButton={Lsi.cancel[lang]}
          confirmButton={Lsi.confirm[lang]}
          header={Lsi.confirmHeader[lang]}
          content={Lsi.confirmMessage[lang]}
          centered={false}
          onConfirm={handleDelete}
          onCancel={handleDeleteModal}
          open={deleteModal}
        />
      </Container>
    </>
  );
}

export default RepositoryPage;
