"use client";

import { User } from "@/libs/definitions";
import { useSession } from "next-auth/react";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";
import ImageSource from "../ImageSource";
import { updateUserProfile, userImageUpdate } from "@/app/actions/user-actions";
import { formatDate } from "@/libs/helpers";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import ModalChangePassword from "../modals/ModalChangePassword";

type TInputs = {
  name: string;
  email: string;
};

function FormUserProfile({ user }: { user: User | null }) {
  const { data: session } = useSession();

  const [block, setBlock] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<TInputs>({
    defaultValues: {
      name: user?.Partner.name ?? "Desconocido",
      email: user?.email ?? "Desconocido",
    },
  });

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    setDisabled(true);
    setBlock(true);
    const toastId = toast.loading("Actualizando perfil...", {
      position: "bottom-right",
    });

    const res = await updateUserProfile(data);

    if (!res.success) {
      toast.error(res.message, { id: toastId });
      return;
    }

    toast.success(res.message, { id: toastId });

    setDisabled(false);
    setBlock(true);
  };

  const handleImageUrl = async (url: string) => {
    if (!url) return;
    await userImageUpdate(url);
  };

  return (
    <Row className="justify-content-center">
      <Col xs="12" sm="12" md="10" lg="10">
        <Form className="card mt-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-header d-flex justify-content-between">
            <h5 className="card-title text-capitalize">{user?.Partner.name}</h5>
            <fieldset className="d-flex gap-1" disabled={disabled}>
              <Button
                onClick={() => setBlock(!block)}
                size="sm"
                variant="light"
                title={block ? "Desbloquear" : "Bloquear"}
              >
                {block ? (
                  <i className="bi bi-unlock-fill"></i>
                ) : (
                  <i className="bi bi-lock-fill"></i>
                )}
              </Button>
              <Button
                variant="light"
                type="submit"
                size="sm"
                disabled={!isDirty}
                title="Guardar"
              >
                <i className="bi bi-cloud-arrow-up-fill"></i>
              </Button>
              <DropdownButton
                title={<i className="bi bi-gear-fill"></i>}
                size="sm"
                className="text-capitalize"
                variant="light"
              >
                {user?.id === session?.user?.id && (
                  <Dropdown.Item
                    href="#"
                    onClick={() => setModalChangePassword(true)}
                  >
                    cambiar contraseña
                  </Dropdown.Item>
                )}
                {user?.id !== session?.user?.id && (
                  <Dropdown.Item href="#">Seguir</Dropdown.Item>
                )}
              </DropdownButton>
            </fieldset>
          </div>
          <fieldset className="card-body container" disabled={block}>
            <Row className="justify-content-end">
              <Col md="3" className="text-center">
                <ImageSource
                  entityType="users"
                  entityId={session?.user?.id}
                  getUrl={handleImageUrl}
                />
              </Col>
              <Col md="9">
                <legend>Información de usuario</legend>
                <Form.Group className="mb-3" controlId="UserName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    {...register("name", {
                      required: "Este campo es requerido",
                    })}
                    size="lg"
                    type="text"
                    autoComplete="off"
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="UserEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    {...register("email", {
                      required: "Este campo es requrido",
                    })}
                    size="lg"
                    type="email"
                    autoComplete="off"
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </fieldset>
          <div className="card-footer d-flex justify-content-between align-items-center gap-2">
            <small>
              <strong>Creado el: </strong>
              {formatDate(user?.createdAt ?? "")}
            </small>
            <small>
              <strong>Última conexión: </strong>
              {formatDate(user?.lastLogin ?? "")}
            </small>
            <small>
              <strong>Última modificación: </strong>
              {formatDate(user?.updatedAt ?? "")}
            </small>
          </div>
        </Form>
      </Col>
      <ModalChangePassword
        show={modalChangePassword}
        onHide={() => setModalChangePassword(false)}
      />
    </Row>
  );
}

export default FormUserProfile;
