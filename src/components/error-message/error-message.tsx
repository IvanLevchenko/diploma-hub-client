import { Button } from "semantic-ui-react";
import { Icon } from "@mdi/react";
import { mdiClose, mdiInformationOutline } from "@mdi/js";

import "./error-message.scss";
import { useState } from "react";

interface Props {
  message: string;
  onClose: () => void;
}

function ErrorMessage(props: Props) {
  const [disappear, setDisappear] = useState<boolean>();

  if (!props.message) {
    return <></>;
  } else {
    setTimeout(() => {
      props.onClose();
    }, 2000);
    setTimeout(() => {
      setDisappear(true);
    }, 1500);
    return (
      <div
        className={`error-message__error-message ${
          disappear ? "disappear" : ""
        }`}
      >
        <Icon path={mdiInformationOutline} size="25" color="darkred" />
        {props.message}
        <Button className="error-message__close-button" onClick={props.onClose}>
          <Icon path={mdiClose} size="15" color="darkred" />
        </Button>
      </div>
    );
  }
}

export default ErrorMessage;
