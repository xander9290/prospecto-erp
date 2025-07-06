// app/page.tsx
"use client";

import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Link from "next/link";

export default function LandingPage() {
  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="text-center shadow-lg p-4">
            <Card.Body>
              <h1 className="mb-4">Bienvenido a Nuestro Sistema</h1>
              <p className="mb-4">
                Si ya tienes acceso, inicia sesión. Si no, puedes solicitar
                autorización.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/auth/login" passHref>
                  <Button variant="primary">Iniciar sesión</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary">Solicitar acceso</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
