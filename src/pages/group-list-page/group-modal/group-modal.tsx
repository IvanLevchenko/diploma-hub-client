import * as React from "react";
import { useContext, useState } from "react";
import { Button, Input, Modal } from "semantic-ui-react";
import {
  GroupCreateDto,
  GroupUpdateDto,
} from "../../../../shared-types/dto/group";

import LsiContext from "../../../lsi/lsi-context";

import Lsi from "./lsi";
import "./group-modal.scss";
import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";

interface Props {
  onClose: () => void;
  onSubmit: (payload: GroupCreateDto) => void;
  onUpdate: (payload: GroupUpdateDto) => void;
  mode: "create" | "update" | undefined;
  id: string;
  name: string | undefined;
}

function GroupModal(props: Props): JSX.Element {
  const { lang } = useContext(LsiContext);
  const [groupPayload, setGroupPayload] = useState<GroupCreateDto>();
  const [disabled, setDisabled] = useState<boolean>(!!groupPayload?.name);

  function handleChange(
    _: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) {
    setGroupPayload({
      name: `${data.value}`,
    });

    if (groupPayload?.name) {
      setDisabled(false);
    }
  }

  function handleSubmit() {
    if (groupPayload?.name) {
      props.onSubmit(groupPayload);
    }
  }

  function handleUpdate() {
    if (groupPayload?.name) {
      props.onUpdate({ id: props.id, ...groupPayload });
    }
  }

  return (
    <Modal
      className="group-modal"
      centered={false}
      onClose={props.onClose}
      open
    >
      <Modal.Header>
        {Lsi[props.mode === "create" ? "headerCreate" : "headerUpdate"][lang]}
      </Modal.Header>
      <Modal.Content>
        <Input
          onChange={handleChange}
          className="group-modal__name"
          placeholder={Lsi.namePlaceholder[lang]}
          name="name"
          defaultValue={props.name || null}
          required
        />
        <div className="group-modal__buttons">
          <Button onClick={props.onClose}>{Lsi.cancelButton[lang]}</Button>
          <Button
            color="blue"
            disabled={disabled}
            onClick={props.mode === "create" ? handleSubmit : handleUpdate}
          >
            {
              Lsi[props.mode === "create" ? "createButton" : "updateButton"][
                lang
              ]
            }
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default GroupModal;
