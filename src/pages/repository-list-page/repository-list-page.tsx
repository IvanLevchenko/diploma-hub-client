import React, { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Container, Loader } from "semantic-ui-react";
import { Repository } from "../../../shared-types/entities/repository";
import { RepositoryListDto } from "../../../shared-types/dto/repository";

import RepositoryBlock from "./repository-block/repository-block";
import ListManager from "./list-manager/list-manager";
import CreateRepositoryForm from "./create-repository-form/create-repository-form";
import ErrorMessage from "../../components/error-message/error-message";
import { ErrorMap } from "../../calls/interfaces/error-map";

import Calls from "../../calls/calls";
import "./repository-list-page.scss";

function RepositoryListPage() {
  const [loader, setLoader] = useState<boolean>(true);
  const [repositories, setRepositories] = useState<Repository[]>();
  const [repositoryForm, setRepositoryForm] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    getRepositories();
  }, []);

  function getRepositories(filters: RepositoryListDto = {}) {
    Calls.repository
      .list({ ...filters })
      .then((response: AxiosResponse<Repository[]>) => {
        setRepositories(response.data);
        setLoader(false);
      })
      .catch((e: AxiosError) => {
        setLoader(false);
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap?.message);
      });
  }

  function handleRepositoryForm() {
    setRepositoryForm(!repositoryForm);
  }

  function handleFilter(repositories: Repository[]) {
    setRepositories(repositories);
  }

  function handleClearFilters(activeFilters: RepositoryListDto | undefined) {
    getRepositories(activeFilters);
  }

  function handleCloseError() {
    setErrorMessage("");
  }

  return (
    <Container>
      <ListManager
        onFormOpen={handleRepositoryForm}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
      />
      <div className="repositories">
        {repositories?.map((repository) => (
          <RepositoryBlock {...repository} key={repository.id} />
        ))}
        <Loader active={loader} />
      </div>
      {repositoryForm && (
        <CreateRepositoryForm open onClose={handleRepositoryForm} />
      )}
      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={handleCloseError} />
      )}
    </Container>
  );
}

export default RepositoryListPage;
