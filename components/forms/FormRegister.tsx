"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type TInputs = {
  name: string;
  email: string;
};

function FormRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    console.log(data);
  };

  useEffect(() => {
    setFocus("name");
  }, []);

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
            <fieldset className="card-body">
              <Form.Group controlId="User" className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  {...register("name", {
                    required: "Este campo es requerido",
                  })}
                  type="text"
                  autoComplete="off"
                  className="text-center fs-5"
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
                  type="password"
                  autoComplete="off"
                  className="text-center fs-4"
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
