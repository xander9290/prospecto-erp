"use client";

import { ModalBasicProps } from "@/libs/definitions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  ListGroup,
  Modal,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";

type FormViewTemplateProps = {
  children?: React.ReactNode;
  viewForm: string;
  formActions?: TFormActions[];
  formStates?: TFormState[];
  state?: string;
  name?: string;
  disableForm?: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isDirty: boolean;
  revert: () => void;
};

type TFormActions = {
  string: string;
  action: () => void;
  confirm?: string;
  invisible?: boolean;
  disable?: boolean;
};

export type TFormState = {
  name: string;
  label: string;
};

function FormViewTemplate({
  children,
  viewForm,
  formActions,
  formStates,
  state,
  name,
  disableForm,
  onSubmit,
  isDirty,
  revert,
}: FormViewTemplateProps) {
  const searchParams = useSearchParams();
  const model_id = searchParams.get("id");

  const router = useRouter();

  const [modalConfirmFormAction, setModalConfirmFormAction] =
    useState<ModalBasicProps>({
      show: false,
      action: undefined,
      string: undefined,
    });

  const handleActionForm = (action: () => void, confirm?: string) => {
    if (confirm) {
      setModalConfirmFormAction({ show: true, action, string: confirm });
    } else {
      action();
    }
  };

  return (
    <Row className="h-100 overflow-auto">
      <Col xs="12" sm="12" md="12" lg="12" xxl="9" className="h-100">
        <Form
          onSubmit={onSubmit}
          style={{ height: "90%" }}
          className="card d-flex flex-column shadow"
        >
          <fieldset className="card-header d-flex justify-content-between">
            <div
              className="d-flex align-items-center gap-2"
              style={{ pointerEvents: disableForm ? "none" : "auto" }}
            >
              {model_id === "null" ? null : (
                <Button
                  className="fw-bold"
                  onClick={() => router.replace(viewForm)}
                  size="sm"
                  disabled={disableForm}
                >
                  Nuevo
                </Button>
              )}
              <Button
                variant="secondary"
                type="submit"
                title="Guardar"
                disabled={!isDirty}
                size="sm"
              >
                <i className="bi bi-cloud-arrow-up-fill"></i>
              </Button>
              <Button
                variant="secondary"
                type="button"
                title="Deshacer"
                disabled={!isDirty}
                onClick={revert}
                size="sm"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </Button>
            </div>
            <div className="d-flex gap-2">
              {/* Desktop buttons */}
              <div className="d-none d-md-flex gap-2">
                {formActions?.map((action, i) => (
                  <Button
                    size="sm"
                    variant="warning"
                    key={`form-action-${i}-${action.string}`}
                    onClick={() =>
                      handleActionForm(action.action, action.confirm)
                    }
                    className="fw-bold text-dark"
                    style={{
                      display: action.invisible ? "none" : "inline-block",
                    }}
                    disabled={action.disable}
                  >
                    <span className="text-capitalize">{action.string}</span>
                  </Button>
                ))}
              </div>

              {/* Mobile dropdown */}
              <div className="d-flex d-md-none">
                <DropdownButton
                  variant="warning"
                  title="Acciones"
                  align="end"
                  size="sm"
                >
                  {formActions
                    ?.filter((action) => !action.invisible)
                    .map((action, i) => (
                      <Dropdown.Item
                        as="button"
                        type="button"
                        key={`form-action-dropdown-${i}-${action.string}`}
                        onClick={() =>
                          handleActionForm(action.action, action.confirm)
                        }
                        disabled={action.disable}
                      >
                        {action.string}
                      </Dropdown.Item>
                    ))}
                </DropdownButton>
              </div>
            </div>
            <Button
              onClick={() => router.back()}
              variant="info"
              title="Regresar"
              size="sm"
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
          </fieldset>
          <fieldset
            className="card-body  flex-fill overflow-auto"
            disabled={disableForm}
          >
            <div className="d-flex justify-content-between align-items-end mb-2">
              <h2 className="card-title fw-bolder text-capitalize">
                {name ?? "nuevo"}
              </h2>
              {/* {disableForm && <Spinner animation="border" />} */}
              {/* STATEBAR - Desktop */}
              <ListGroup horizontal className="d-none d-md-flex">
                {formStates?.map((st, i) => (
                  <ListGroup.Item
                    key={`form-states-${i}-${st.label}`}
                    className="border fw-bolder text-uppercase"
                    active={st.name === state ? true : false}
                  >
                    {st.label || "estado"}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* STATEBAR - Mobile (Dropdown) */}
              <div className="d-flex d-md-none">
                <ListGroup>
                  <ListGroup.Item
                    variant="warning"
                    className="border fw-bolder text-uppercase"
                  >
                    {formStates?.find((st) => st.name === state)?.label ||
                      "estado"}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </div>
            <div className="container-fluid p-0">
              <Row className="gy-2">{children}</Row>
            </div>
          </fieldset>
        </Form>
      </Col>
      <Col xs="12" sm="12" md="12" lg="12" xxl="3">
        En esta parte irá el historial
      </Col>
      <ModalActionConfirm
        show={modalConfirmFormAction.show}
        onHide={() =>
          setModalConfirmFormAction({ show: false, action: undefined })
        }
        action={modalConfirmFormAction.action}
        string={modalConfirmFormAction.string}
      />
    </Row>
  );
}

export const ViewGroup = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <Col xs="12" md="6">
      {title && (
        <h5 className="text-capitalize border-bottom border-2 fw-bold mt-2">
          {title}
        </h5>
      )}
      <div className="p-3 bg-body-tertiary rounded">{children}</div>
    </Col>
  );
};

export const ViewGroupFluid = ({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname?: string;
}) => {
  return (
    <Col xs="12" md="12" className="mt-2">
      <div className={`p-2 rounded ${classname}`}>{children}</div>
    </Col>
  );
};

export const Notebook = ({
  children,
  dKey,
}: {
  children: React.ReactNode;
  dKey: string;
}) => {
  const [key, setKey] = useState(dKey);
  return (
    <ViewGroupFluid>
      <Tabs accessKey={key} onSelect={(k) => setKey(k || "")}>
        {children}
      </Tabs>
    </ViewGroupFluid>
  );
};

export const NotePage = ({
  children,
  eventKey,
  title,
}: {
  children: React.ReactNode;
  eventKey: string;
  title: string;
}) => {
  return (
    <Tab eventKey={eventKey} title={title}>
      {children}
    </Tab>
  );
};

const ModalActionConfirm = ({
  show,
  onHide,
  action,
  string,
}: {
  show: boolean;
  onHide: () => void;
  action?: () => void;
  string?: string;
}) => {
  const handleAccept = () => {
    if (action) {
      setTimeout(() => {
        action();
      }, 400);
    }
    onHide();
  };
  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>Confirmar Acción</Modal.Header>
      <Modal.Body>{string ?? "¿Ejecutar acción?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleAccept}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormViewTemplate;
