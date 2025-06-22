"use client";

import { userRequest } from "@/app/actions/user-actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type TInputs = {
  name: string;
  email: string;
};

function FormRegister() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Enviando solicitud...", {
      position: "top-center",
    });

    const res = await userRequest(data);

    if (!res.success) {
      toast.error(res.message, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success(res.message, { id: toastId });

    setLoading(false);
  };

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs="12" sm="10" md="7" lg="5" xl="4">
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="card bg-body-tertiary  shadow-sm mt-5"
          >
            <div className="card-header d-flex justify-content-between">
              <h4 className="card-title">Solicitud de acceso</h4>
              <Link className="btn btn-info btn-sm" href="/" title="Inicio">
                <i className="bi bi-house-fill"></i>
              </Link>
            </div>
            <fieldset className="card-body" disabled={loading}>
              <Form.Group controlId="User" className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  {...register("name", {
                    required: "Este campo es requerido",
                  })}
                  type="text"
                  autoComplete="off"
                  className="fs-5"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="Password" className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  {...register("email", {
                    required: "Este campo es requerido",
                  })}
                  type="text"
                  autoComplete="off"
                  className="fs-4"
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Button type="submit">Enviar</Button>
              </Form.Group>
            </fieldset>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FormRegister;
