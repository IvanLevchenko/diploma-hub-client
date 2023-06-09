import { Form, Loader, Modal } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { FileCreateDtoOut } from "../../../../shared-types/dto/file";

import { ErrorMap } from "../../../calls/interfaces/error-map";
import PlagiarismModal from "../plagiarism-modal/plagiarism-modal";
import ErrorMessage from "../../../components/error-message/error-message";
import LsiContext from "../../../lsi/lsi-context";

import Lsi from "./lsi";
import Calls from "../../../calls/calls";
import "./upload-file-form.scss";

interface Props {
  onClose(): void;
  open: boolean;
}

type PlagiarismResult = Pick<FileCreateDtoOut, "passed" | "percent">;

const formIds = {
  filename: "filename",
  file: "file",
};

function UploadFileForm(props: Props): JSX.Element {
  const { lang } = useContext(LsiContext);
  const [params] = useSearchParams();
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>();
  const [disabledButton, setDisabledButton] = useState<boolean>();
  const [loader, setLoader] = useState<boolean>();
  const [plagiarismData, setPlagiarismData] = useState<PlagiarismResult>();
  const [plagiarismModal, setPlagiarismModal] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const formData = new FormData();

  async function handleSubmit() {
    if (!formDataFilled()) {
      return;
    }

    setDisabledButton(true);
    setLoader(true);

    let plagiarismResult: PlagiarismResult;

    setPlagiarismModal(true);
    await Calls.file
      .create(formData)
      .then((response: AxiosResponse<PlagiarismResult>) => {
        plagiarismResult = {
          passed: response.data.passed,
          percent: response.data.percent,
        };
        setPlagiarismData(plagiarismResult);

        setTimeout(() => {
          location.reload();
        }, 1000);
      })
      .catch((e: AxiosError) => {
        const errorMap = e.response?.data as ErrorMap;
        const params = errorMap.params as PlagiarismResult;

        setPlagiarismData({
          percent: params.percent,
          passed: params.passed,
        });

        setErrorMessage(errorMap.message);
      });

    setLoader(false);
    setDisabledButton(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === formIds.filename) {
      setFileName(e.target.value);
    }

    if (e.target.id === formIds.file && e.target?.files?.length) {
      setFile(e.target.files[0]);
    }
  }

  function formDataFilled(): boolean {
    if (!fileName || !file) {
      return false;
    }

    formData.append("repositoryId", `${params.get("id")}`);
    formData.append("filename", fileName);
    formData.append("data", file);

    return true;
  }

  function handleRemoveErrorMessage() {
    setErrorMessage("");
  }

  return (
    <Modal open={props.open} size="tiny" centered={false}>
      <Form
        className={`form-wrapper__form ${errorMessage ? "error" : ""}`}
        onSubmit={handleSubmit}
      >
        <Form.Input
          label={Lsi.name[lang]}
          id={formIds.filename}
          onChange={handleChange}
          required
        ></Form.Input>
        <Form.Input
          id={formIds.file}
          accept="application/pdf"
          label={Lsi.select[lang]}
          type="file"
          onChange={handleChange}
          required
        ></Form.Input>
        <div className="form-wrapper__form-buttons">
          <Form.Button color="blue" type="submit" disabled={disabledButton}>
            {Lsi.submit[lang]}
          </Form.Button>
          <Form.Button onClick={props.onClose}>{Lsi.cancel[lang]}</Form.Button>
        </div>
        {loader && <Loader active={loader} />}
        {plagiarismModal && plagiarismData && (
          <PlagiarismModal
            percent={plagiarismData.percent}
            passed={plagiarismData.passed}
            onClose={props.onClose}
          />
        )}
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

export default UploadFileForm;
