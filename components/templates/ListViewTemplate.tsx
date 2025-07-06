"use client";

import Link from "next/link";
import { Card, Col, Row } from "react-bootstrap";
import FormSearchHeader from "../forms/FormSearchHeader";
import SimplePagination from "./SimplePagination";

type ListViewTemplateProps = {
  children?: React.ReactNode;
  viewForm: string;
  title: string;
  search: (key: string | undefined) => void;
  basePath: string;
  page: number;
  perPage: number;
  total: number;
};

function ListViewTemplate({
  children,
  viewForm,
  title,
  search,
  basePath,
  page = 1,
  perPage = 50,
  total = 0,
}: ListViewTemplateProps) {
  const handleSearch = (key: string | undefined) => {
    return search(key ?? "");
  };

  return (
    <Card className="h-100 d-flex flex-column">
      <Card.Header>
        <Row className="g-2 align-items-end">
          <Col xs="12" md="5">
            <div className="d-flex align-items-center gap-2">
              <Link className="btn btn-info btn-sm" href={viewForm}>
                Nuevo
              </Link>
              <Card.Title className="mb-0 text-capitalize">{title}</Card.Title>
            </div>
          </Col>
          <Col xs="12" md="3">
            <FormSearchHeader search={handleSearch} />
          </Col>
          <Col xs="12" md="4" className="d-flex justify-content-end">
            <SimplePagination
              total={total}
              page={page}
              perPage={perPage}
              basePath={basePath}
            />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="p-0 flex-fill overflow-auto">{children}</Card.Body>
      <Card.Footer></Card.Footer>
    </Card>
  );
}

export default ListViewTemplate;
