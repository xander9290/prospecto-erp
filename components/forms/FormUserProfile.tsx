"use client";

import { User } from "@/libs/definitions";
import { useSession } from "next-auth/react";
// import { useState } from "react";
import { Col, Dropdown, DropdownButton, Form, Row } from "react-bootstrap";
// import toast from "react-hot-toast";
import ImageSource from "../ImageSource";
import { userImageUpdate } from "@/app/actions/user-actions";
import { formatDate } from "@/libs/helpers";

function FormUserProfile({ user }: { user: User | null }) {
  const { data: session } = useSession();

  // const [disabled, setDisabled] = useState(true);

  const handleImageUrl = async (url: string) => {
    if (!url) return;
    await userImageUpdate(url);
  };

  return (
    <Row className="justify-content-center">
      <Col xs="12" sm="12" md="10" lg="10">
        <Form className="card mt-1">
          <div className="card-header d-flex justify-content-between">
            <h5 className="card-title text-capitalize">{user?.Partner.name}</h5>
            <DropdownButton
              title={<i className="bi bi-gear"></i>}
              size="sm"
              className="text-capitalize"
              variant="light"
            >
              {user?.id === session?.user?.id && (
                <Dropdown.Item href="#">cambiar contraseña</Dropdown.Item>
              )}
              {user?.id !== session?.user?.id && (
                <Dropdown.Item href="#">Seguir</Dropdown.Item>
              )}
            </DropdownButton>
          </div>
          <fieldset className="card-body container">
            <Row className="justify-content-end">
              <Col md="2">
                <ImageSource
                  entityType="users"
                  entityId={session?.user?.id}
                  getUrl={handleImageUrl}
                />
              </Col>
            </Row>
          </fieldset>
          <div className="card-footer d-flex justify-content-between align-items-center gap-2">
            <span>
              <strong>Creado el: </strong>
              {formatDate(user?.createdAt ?? "")}
            </span>
            <span>
              <strong>Última conexión: </strong>
              {formatDate(user?.lastLogin ?? "")}
            </span>
            <span>
              <strong>Última modificación: </strong>
              {formatDate(user?.lastLogin ?? "")}
            </span>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default FormUserProfile;
