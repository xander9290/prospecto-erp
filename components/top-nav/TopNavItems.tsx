"use client";

import Link from "next/link";
import { Nav, NavDropdown } from "react-bootstrap";

function TopNavItems() {
  return (
    <Nav className="me-auto">
      <NavDropdown
        title={
          <>
            <i className="bi bi-gear-fill"></i>
            <span className="ms-1">Ajustes</span>
          </>
        }
      >
        <NavDropdown.Item
          as={Link}
          href="/app/settings/users?view_mode=list&page=1"
        >
          <i className="bi bi-person-fill"></i>
          <span className="ms-1">Usuarios</span>
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} href="/app/settings/roles?view_mode=list">
          <i className="bi bi-people-fill"></i>
          <span className="ms-1">Grupos</span>
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

export default TopNavItems;
