import { Button, Input } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import { mdiClose, mdiFilter } from "@mdi/js";
import { Icon } from "@mdi/react";
import { AxiosError, AxiosResponse } from "axios";
import { Repository } from "../../../../shared-types/entities/repository";
import { RepositoryListDto } from "../../../../shared-types/dto/repository";

import FilterModal from "./filter-modal/filter-modal";
import SessionContext from "../../../hocs/private-route/session-context";
import LsiContext from "../../../lsi/lsi-context";
import ErrorMessage from "../../../components/error-message/error-message";
import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import { UserRoles } from "../../../enums/user-roles";

import Lsi from "./lsi";
import Calls from "../../../calls/calls";
import "./list-manager.scss";
import { ErrorMap } from "../../../calls/interfaces/error-map";

interface Props {
  onFormOpen(): void;
  onFilter(payload: Repository[]): void;
  onClearFilters(activeFilters: RepositoryListDto | undefined): void;
}

function ListManager(props: Props): JSX.Element {
  const [filterModal, setFilterModal] = useState<boolean>();
  const [filterModalCollapsed, setFilterModalCollapsed] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string | null>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [hasFilters, setHasFilters] = useState<boolean>();
  const [activeFilters, setActiveFilters] = useState<RepositoryListDto>();
  const session = useContext(SessionContext);
  const { lang } = useContext(LsiContext);

  function handleFilterModal() {
    setFilterModal(!filterModal);
    setFilterModalCollapsed(false);
  }

  function handleFilterModalCollapse() {
    setFilterModalCollapsed(!filterModalCollapsed);
  }

  function handleSearchRequest(payload: { name: string }) {
    let dto;

    if (activeFilters) {
      dto = { ...payload, ...activeFilters };
    } else {
      dto = { ...payload };
    }

    Calls.repository
      .list(dto)
      .then((response: AxiosResponse<Repository[]>) => {
        props.onFilter(response.data);
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  function handleFilter(payload: RepositoryListDto) {
    const dto = { ...payload };
    setActiveFilters(dto);

    if (searchQuery) {
      dto.name = searchQuery;
    }

    Calls.repository
      .list(dto)
      .then((response: AxiosResponse<Repository[]>) => {
        props.onFilter(response.data);
        setHasFilters(true);
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }

  function handleClearSearch() {
    setSearchQuery("");
    handleSearchRequest({ name: "" });
  }

  function handleSearch(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.type === "click") {
      handleSearchRequest({ name: `${searchQuery}` });
    } else {
      const event = e as React.KeyboardEvent<HTMLInputElement>;

      if (event.key === "Enter") {
        handleSearchRequest({ name: `${searchQuery}` });
      }
    }
  }

  function handleSearchChange(
    _: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) {
    setSearchQuery(data.value);
  }

  function handleErrorClose() {
    setErrorMessage("");
  }

  function handleClearFilters() {
    setHasFilters(false);
    setFilterModal(false);

    props.onClearFilters({ name: searchQuery || "" });
  }

  function canCreate() {
    return (
      session?.role === UserRoles.ADMIN || session?.role === UserRoles.TEACHER
    );
  }

  return (
    <div className="list-manager">
      <div className="list-manager__options-wrapper">
        <div className="list-manager__options">
          <Input
            name="name"
            placeholder={Lsi.search[lang]}
            labelPosition="right"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyUp={handleSearch}
            icon={
              <div
                className={!searchQuery ? "hidden" : ""}
                onClick={handleClearSearch}
              >
                <Icon
                  path={mdiClose}
                  size="15"
                  className="list-manager__options-clear-icon"
                />
              </div>
            }
            label={
              <Button disabled={!searchQuery} onClick={handleSearch}>
                {Lsi.search[lang]}
              </Button>
            }
          />
          <Button
            className={`list-manager__options-filter-button ${
              hasFilters ? "list-manager__options-filter-button-bubble" : ""
            }`}
            size="small"
            onClick={
              !filterModal ? handleFilterModal : handleFilterModalCollapse
            }
          >
            <Icon path={mdiFilter} size="15" />
          </Button>
          <Button
            className="list-manager__options-clear"
            onClick={handleClearFilters}
            disabled={!hasFilters}
          >
            {Lsi.clearFiltersButton[lang]}
          </Button>
          {filterModal && (
            <FilterModal
              closed={filterModalCollapsed}
              onClose={handleFilterModalCollapse}
              onFilter={handleFilter}
            />
          )}
        </div>
      </div>
      {canCreate() && (
        <Button onClick={props.onFormOpen}>{Lsi.createButton[lang]}</Button>
      )}
      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={handleErrorClose} />
      )}
    </div>
  );
}

export default ListManager;
