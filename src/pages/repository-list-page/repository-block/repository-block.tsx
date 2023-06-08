import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Repository } from "../../../../shared-types/entities/repository";
import { Icon } from "@mdi/react";
import { mdiCalendarRange } from "@mdi/js";
import { Label, SemanticCOLORS } from "semantic-ui-react";

import LsiContext from "../../../lsi/lsi-context";

import subjects from "../../../static/subjects.json";
import "./repository-block.scss";

function RepositoryBlock(props: Repository): JSX.Element {
  const navigate = useNavigate();
  const { lang } = useContext(LsiContext);

  const color = subjects.find((subject) => subject.name === props.subject)
    ?.color as SemanticCOLORS;

  function handleNavigate() {
    navigate(`/repository?id=${props.id}`);
  }

  function getSubjectTranslate(subjectName: string): string {
    if (lang === "ua") return subjectName;

    const matchedSubject = subjects.find(
      (subject) => subject.name === subjectName
    );

    if (!matchedSubject) return subjectName;
    const translateObject = matchedSubject.translate as {
      [key: string]: string;
    };

    return translateObject[lang];
  }

  return (
    <div className="repository" onClick={handleNavigate}>
      <div>
        <p title={props.name} className="repository__header">
          {props.name.length > 20
            ? props.name.slice(0, 20) + "..."
            : props.name}
        </p>
        <p className="repository__info">
          <Icon path={mdiCalendarRange} size="15" color="grey" />
          {new Date(props.created).toLocaleDateString()}
        </p>
      </div>
      <Label color={color}>{getSubjectTranslate(props.subject)}</Label>
    </div>
  );
}

export default RepositoryBlock;
