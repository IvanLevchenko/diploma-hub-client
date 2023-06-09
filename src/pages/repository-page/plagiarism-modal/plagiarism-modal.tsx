import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useContext, useEffect } from "react";
import { Icon } from "@mdi/react";
import { mdiClose } from "@mdi/js";
import "react-circular-progressbar/dist/styles.css";

import LsiContext from "../../../lsi/lsi-context";

import Lsi from "./lsi";
import "./plagiarism-modal.scss";

interface Props {
  percent: number;
  passed: boolean;
  onClose: () => void;
}

type Color = "green" | "orange" | "red";

function PlagiarismModal(props: Props): JSX.Element {
  const { lang } = useContext(LsiContext);

  useEffect(() => {
    return;
  }, [props.percent, props.passed]);

  let color: Color;

  if (props.percent < 80) {
    color = "red";
  } else if (props.percent > 80 && props.percent < 85) {
    color = "orange";
  } else {
    color = "green";
  }

  return (
    <div className="plagiarism-modal">
      <div className="plagiarism-modal__close">
        <div onClick={props.onClose}>
          <Icon path={mdiClose} size="30" />
        </div>
      </div>
      <p>{props.passed ? Lsi.passed[lang] : Lsi.notPassed[lang]}</p>
      <div className="plagiarism-modal__chart">
        <CircularProgressbar
          styles={buildStyles({
            pathColor: color,
            textColor: color,
          })}
          value={props.percent}
          text={`${props.percent}%`}
        />
      </div>
    </div>
  );
}

export default PlagiarismModal;
