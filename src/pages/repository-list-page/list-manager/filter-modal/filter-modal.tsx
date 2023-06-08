import {
  Button,
  Input,
  Label,
  Select,
  SemanticCOLORS,
} from "semantic-ui-react";
import React, { useContext, useState } from "react";
import { InputOnChangeData } from "semantic-ui-react/src/elements/Input";
import { DropdownProps } from "semantic-ui-react/src/modules/Dropdown";
import { RepositoryListDto } from "../../../../../shared-types/dto/repository";

import LsiContext from "../../../../lsi/lsi-context";

import Lsi from "./lsi";
import subjectsJson from "../../../../static/subjects.json";
import "./filter-modal.scss";

interface Props {
  closed: boolean;
  onClose: () => void;
  onFilter: (payload: RepositoryListDto) => void;
}

function FilterModal(props: Props): JSX.Element {
  const [filterPayload, setFilterPayload] = useState<RepositoryListDto>();
  const { lang } = useContext(LsiContext);

  const subjects = subjectsJson.map((subject) => ({
    text: <Label color={subject.color as SemanticCOLORS}>{subject.name}</Label>,
    value: subject.name,
  }));

  function handleFilterChange(
    _: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent<HTMLElement>,
    data: InputOnChangeData | DropdownProps
  ) {
    setFilterPayload((prevState) => ({
      ...prevState,
      [data.id]: data.type === "date" ? new Date(`${data.value}`) : data.value,
    }));
  }

  function handleFilter() {
    if (!filterPayload) {
      return;
    }

    const hasFilters = Object.keys(filterPayload).length;

    if (hasFilters) {
      props.onFilter(filterPayload);
    }
  }

  function handleClose() {
    props.onClose();
  }

  return (
    <div className={`${props.closed ? "closed" : ""}`}>
      <div className="filter-modal__wrapper" onClick={handleClose}></div>
      <div className="filter-modal__modal">
        <div className="filter-modal__modal-dates">
          <Input
            type="date"
            id="dateFrom"
            className="filter-modal__modal-dates-input"
            onChange={handleFilterChange}
          />
          -
          <Input
            type="date"
            id="dateTo"
            className="filter-modal__modal-dates-input"
            onChange={handleFilterChange}
          />
        </div>
        <Select
          className="filter-modal__modal-select"
          options={subjects}
          id="subjects"
          placeholder={Lsi.subjects[lang]}
          onChange={handleFilterChange}
          multiple
        />
        <Button color="blue" onClick={handleFilter}>
          {Lsi.filter[lang]}
        </Button>
      </div>
    </div>
  );
}

export default FilterModal;
