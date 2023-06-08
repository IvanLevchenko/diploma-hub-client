import { User } from "../../../../shared-types/entities/user";
import { useContext, useEffect, useState } from "react";
import { Confirm, Dropdown, Image } from "semantic-ui-react";
import { AxiosResponse } from "axios";

import SessionContext from "../../../hocs/private-route/session-context";
import LsiContext from "../../../lsi/lsi-context";
import EditModal from "./edit-modal/edit-modal";

import Lsi from "./lsi";
import Calls from "../../../calls/calls";
import "./repository-file.scss";

interface Props {
  id: string;
  name: string;
  author: User;
  filepath: string;
  onOpen: (filepath: string) => void;
}

function RepositoryFile(props: Props): JSX.Element {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [fileSelected, setFileSelected] = useState<boolean>();
  const [deleteModal, setDeleteModal] = useState<boolean>();
  const [editModal, setEditModal] = useState<boolean>();
  const session = useContext(SessionContext);
  const { lang } = useContext(LsiContext);

  useEffect(() => {
    Calls.file
      .get({ id: props.id, isPreview: "true" })
      .then((response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data]);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      });
  }, []);

  function handleOpenFile(): void {
    props.onOpen(props.id);
  }

  function handleOverFile() {
    setFileSelected(true);
  }

  function handleLeftFile() {
    setFileSelected(false);
  }

  function handleDeleteModal() {
    setDeleteModal(!deleteModal);
  }

  function handleChangeModal() {
    setEditModal(!editModal);
  }

  function handleDelete() {
    Calls.file
      .delete({ id: props.id })
      .then(() => {
        location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div>
      <div
        className="repository-file"
        onMouseOver={handleOverFile}
        onMouseLeave={handleLeftFile}
        onClick={handleOpenFile}
      >
        {previewUrl && (
          <>
            <Image src={previewUrl} className="repository-file__image" />
            <div
              className={fileSelected ? "repository-file__image-wrapper" : ""}
            ></div>
          </>
        )}
        <div className="repository-file__file-info">
          <abbr title={props.name} className="repository-file__file-name">
            {props.name.length > 20
              ? props.name.slice(0, 20) + "..."
              : props.name}
          </abbr>
          <p className="repository-file__author-name">{`${props.author?.firstName} ${props.author?.lastName}`}</p>

          <Dropdown
            icon="ellipsis vertical"
            className="repository-file__dropdown"
            size="mini"
          >
            <Dropdown.Menu className="repository-file__dropdown-menu">
              <Dropdown.Item
                disabled={session?.id !== props.author.id}
                onClick={handleDeleteModal}
              >
                {Lsi.delete[lang]}
              </Dropdown.Item>
              {props.author.id === session?.id ? (
                <Dropdown.Item onClick={handleChangeModal}>
                  {Lsi.rename[lang]}
                </Dropdown.Item>
              ) : (
                <></>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {editModal && (
        <EditModal
          id={props.id}
          filename={props.name}
          onClose={handleChangeModal}
          open
        />
      )}
      {deleteModal && (
        <Confirm
          cancelButton={Lsi.cancel[lang]}
          confirmButton={Lsi.confirm[lang]}
          header={Lsi.confirmHeader[lang]}
          content={Lsi.confirmMessage[lang]}
          centered={false}
          open={deleteModal}
          onCancel={handleDeleteModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default RepositoryFile;
