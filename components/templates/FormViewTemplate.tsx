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
  Spinner,
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
      <Col xs="12" md="8" className="h-100">
        <Form
          onSubmit={onSubmit}
          style={{ height: "90%" }}
          className="card d-flex flex-column shadow"
        >
          <fieldset
            className="card-header d-flex justify-content-between"
            disabled={disableForm}
          >
            <div className="d-flex align-items-center gap-2">
              {model_id === "null" ? null : (
                <Button
                  className="fw-bold"
                  onClick={() => router.replace(viewForm)}
                >
                  Nuevo
                </Button>
              )}
              <Button
                variant="light"
                type="submit"
                title="Guardar"
                disabled={isDirty}
              >
                <i className="bi bi-cloud-arrow-up-fill"></i>
              </Button>
              <Button variant="light" type="button" title="Deshacer">
                <i className="bi bi-arrow-counterclockwise"></i>
              </Button>
            </div>
            <div className="d-flex gap-2">
              {/* Desktop buttons */}
              <div className="d-none d-md-flex gap-2">
                {formActions?.map((action, i) => (
                  <Button
                    variant="info"
                    key={`form-action-${i}-${action.string}`}
                    onClick={() =>
                      handleActionForm(action.action, action.confirm)
                    }
                    className="fw-bold"
                    style={{
                      display: action.invisible ? "none" : "inline-block",
                    }}
                    disabled={action.disable}
                  >
                    {action.string}
                  </Button>
                ))}
              </div>

              {/* Mobile dropdown */}
              <div className="d-flex d-md-none">
                <DropdownButton variant="info" title="Acciones" align="end">
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
              variant="light"
              title="Regresar"
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
          </fieldset>
          <fieldset
            className="card-body  flex-fill overflow-auto"
            disabled={disableForm}
          >
            <div className="d-flex justify-content-between align-items-end mb-2">
              <h4 className="card-title fw-bolder text-capitalize">
                {name ?? "nuevo"}
              </h4>
              {disableForm && <Spinner animation="border" />}
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
            <div className="container p-0">
              <Row className="gy-2">{children}</Row>
            </div>
          </fieldset>
        </Form>
      </Col>
      <Col xs="12" md="4">
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

export const ViewGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <Col xs="12" md="6">
      <div className="p-3 bg-body-tertiary rounded">{children}</div>
    </Col>
  );
};

export const ViewGroupFluid = ({ children }: { children: React.ReactNode }) => {
  return (
    <Col xs="12" md="12" className="mt-2">
      <div className="p-2 bg-body-tertiaryrounded">{children}</div>
    </Col>
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
