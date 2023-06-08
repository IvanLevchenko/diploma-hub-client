import { Button, Form, Modal } from "semantic-ui-react";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import React, { useContext, useEffect, useState } from "react";
import { RepositoryCreateDto } from "../../../../shared-types/dto/repository";
import { Group } from "../../../../shared-types/entities/group";
import { AxiosError, AxiosResponse } from "axios";

import ErrorMessage from "../../../components/error-message/error-message";
import { ErrorMap } from "../../../calls/interfaces/error-map";
import LsiContext from "../../../lsi/lsi-context";

import Lsi from "./lsi";
import Calls from "../../../calls/calls";
import subjects from "../../../static/subjects.json";
import "./create-repository-form.scss";

interface Props {
  onClose: () => void;
  open: boolean;
}

function CreateRepositoryForm(props: Props): JSX.Element {
  const [formData, setFormData] = useState<RepositoryCreateDto>({
    name: "",
    subject: "",
    groups: [],
  });
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [groupSelectList, setGroupSelectList] = useState<
    {
      text: string;
      value: string;
    }[]
  >();
  const { lang } = useContext(LsiContext);

  useEffect(() => {
    Calls.group
      .list({})
      .then((response: AxiosResponse<Group[]>) => {
        const groupsList = response.data?.map((group) => ({
          value: group.id,
          text: group.name,
        }));
        setGroupSelectList(groupsList.length ? groupsList : undefined);
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        setErrorMessage(errorMap.message);
      });
  }, []);

  const subjectList = subjects.map((subject) => ({
    value: subject.name,
    text: subject.name,
  }));

  async function handleSubmit() {
    try {
      await Calls.repository.create(formData);
    } catch (e) {
      const error = e as AxiosError;
      const errorMap = error.response?.data as ErrorMap;
      return setErrorMessage(errorMap.message);
    }
    location.reload();
  }

  function handleChange(
    _: React.SyntheticEvent<HTMLElement | HTMLInputElement>,
    data: DropdownProps | InputOnChangeData
  ) {
    const formState = {
      ...formData,
      [data?.name]: data.value,
    };

    setFormData(formState);
    validateForm(formState);
  }

  function validateForm(formState: RepositoryCreateDto) {
    const isValidated =
      formState.name && formState.subject && formState.groups.length;

    if (isValidated) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }

  function handleClose() {
    props.onClose();
  }

  function handleRemoveErrorMessage() {
    setErrorMessage("");
  }

  return (
    <Modal open={props.open} className="create-repo-form" centered={false}>
      <Modal.Header>{Lsi.header[lang]}</Modal.Header>
      <Form className="create-repo-form__form" onSubmit={handleSubmit}>
        <Form.Field className="create-repo-form__form-field">
          <Form.Input
            name="name"
            placeholder={Lsi.repositoryName[lang]}
            onChange={handleChange}
          ></Form.Input>
        </Form.Field>
        <Form.Field className="create-repo-form__form-field">
          <Form.Select
            options={subjectList}
            onChange={handleChange}
            placeholder={Lsi.subjectName[lang]}
            name="subject"
          />
        </Form.Field>
        <Form.Field className="create-repo-form__form-field">
          <Form.Select
            name="groups"
            placeholder={Lsi.groups[lang]}
            options={groupSelectList || []}
            onChange={handleChange}
            multiple
            required
          ></Form.Select>
        </Form.Field>
        <div>
          <Button color="blue" type="submit" disabled={submitDisabled}>
            {Lsi.createButton[lang]}
          </Button>
          <Button onClick={handleClose}>{Lsi.cancelButton[lang]}</Button>
        </div>
      </Form>
      {errorMessage && (
        <ErrorMessage
          onClose={handleRemoveErrorMessage}
          message={errorMessage}
        />
      )}
    </Modal>
  );
}

export default CreateRepositoryForm;
