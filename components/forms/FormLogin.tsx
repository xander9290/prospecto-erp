"use client";

import { loginUser } from "@/app/actions/user-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type TInputs = {
  userName: string;
  password: string;
};

function FormLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    setLoading(true);
    const res = await loginUser(data);

    if (!res.success) {
      setLoading(false);
      toast.error(res.message);
      return;
    }

    toast.success(res.message, { position: "bottom-right" });

    setLoading(false);

    router.replace("/app");
  };

  useEffect(() => {
    setFocus("userName");
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
              <h4 className="card-title">Inicio de sesión</h4>
              <Link className="btn btn-info btn-sm" href="/" title="Inicio">
                <i className="bi bi-house-fill"></i>
              </Link>
            </div>
            <fieldset className="card-body" disabled={loading}>
              <Form.Group controlId="User" className="mb-3">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  {...register("userName", {
                    required: "Este campo es requerido",
                  })}
                  type="text"
                  autoComplete="off"
                  className="text-center fs-5"
                  isInvalid={!!errors.userName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.userName?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="Password" className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  {...register("password", {
                    required: "Este campo es requerido",
                    minLength: {
                      value: 4,
                      message: "La contraseña debe tener mínimo 4 caracteres",
                    },
                    maxLength: {
                      value: 8,
                      message: "La contraseña debe tener máximo 8 caracteres",
                    },
                  })}
                  type="password"
                  autoComplete="off"
                  className="text-center fs-4"
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="d-grid gap-2">
                <Button type="submit">
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Validando</span>
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </Form.Group>
            </fieldset>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FormLogin;
