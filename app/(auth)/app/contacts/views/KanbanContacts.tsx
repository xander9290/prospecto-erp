"use client";

import { PartnerContacts } from "@/libs/definitions";
import { Card, Col, Container, Row } from "react-bootstrap";
import { ContactFilter } from "./ContactViewList";
import Link from "next/link";

function KanbanContacts({
  partners,
  filter,
}: {
  partners: PartnerContacts[] | null;
  filter: ContactFilter;
}) {
  return (
    <Container fluid>
      <Row className="g-2 py-2">
        {partners?.map((partner) => (
          <Col key={partner.id} xs="12" sm="12" md="6" lg="4" xl="4" xxl="3">
            <Link
              href={`/app/contacts?view_mode=form&id=${partner.id}&filter=${filter}`}
              className="card text-decoration-none"
            >
              <div className="card-body p-1">
                <div className="d-flex gap-2">
                  <Card.Img
                    src={partner.Image?.url ?? "/image/avatar_default.svg"}
                    width={120}
                    height={130}
                    variant="string"
                    className="rounded"
                  />
                  <div>
                    <h6 className="card-title text-uppercase">
                      {partner.name}
                    </h6>
                    <div style={{ fontSize: "0.8rem" }}>
                      <p className="card-text text-uppercase my-1">
                        {partner.street} {partner.colony} {partner.province}{" "}
                        {partner.city}
                      </p>
                      {partner.phone && (
                        <p className="card-text my-1">{partner.phone}</p>
                      )}
                      {partner.email && (
                        <p className="card-text my-1">{partner.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default KanbanContacts;
