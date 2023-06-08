import { Form, Loader, Modal } from "semantic-ui-react";
import * as React from "react";
import { useContext, useState } from "react";
import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";

import LsiContext from "../../../../lsi/lsi-context";

import Calls from "../../../../calls/calls";
import Lsi from "./lsi";
import "./edit-modal.scss";

interface Props {
  open: boolean;
  id: string;
  filename: string;
  onClose: () => void;
}

function EditModal(props: Props) {
  const { lang } = useContext(LsiContext);
  const [fileData, setFileData] = useState({
    id: props.id,
    filename: props.filename,
  });
  const [submitButton, setSubmitButton] = useState<boolean>();
  const [loader, setLoader] = useState<boolean>();

  function handleSubmit() {
    setSubmitButton(!submitButton);
    setLoader(true);
    Calls.file
      .update(fileData)
      .then(() => {
        location.reload();
      })
      .catch(() => {
        setSubmitButton(false);
      });
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) {
    setFileData((prevState) => ({
      ...prevState,
      [event.target.name]: data.value,
    }));
  }

  return (
    <Modal
      open={props.open}
      centered={false}
      size="tiny"
      className="edit-modal"
    >
      <Modal.Header>{Lsi.header[lang]}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            label={Lsi.fileName[lang]}
            name="filename"
            className="edit-modal__filename"
            onChange={handleChange}
            defaultValue={props.filename}
          ></Form.Input>
          <div className="edit-modal__buttons">
            <Form.Button disabled={submitButton} type="submit" color="blue">
              {Lsi.submit[lang]}
            </Form.Button>
            <Form.Button onClick={props.onClose}>
              {Lsi.cancel[lang]}
            </Form.Button>
          </div>
        </Form>
      </Modal.Content>
      {loader && <Loader active />}
    </Modal>
  );
}

export default EditModal;
