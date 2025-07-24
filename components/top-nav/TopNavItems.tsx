"use client";

import Link from "next/link";
import { Nav, NavDropdown } from "react-bootstrap";

function TopNavItems() {
  return (
    <Nav className="me-auto">
      {/* CONTACTOS */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-person-rolodex"></i>
            <span className="ms-1">Contactos</span>
          </>
        }
      >
        <NavDropdown.Item
          as={Link}
          href="/app/contacts?view_mode=list&filter=CUSTOMER&page=1"
        >
          <i className="bi bi-person-lines-fill"></i>
          <span className="ms-1">Clientes</span>
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          href="/app/contacts?view_mode=list&filter=SUPPLIER&page=1"
        >
          <i className="bi bi-building"></i>
          <span className="ms-1">Proveedores</span>
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          href="/app/contacts?view_mode=list&filter=INTERNAL&page=1"
        >
          <i className="bi bi-person-vcard"></i>
          <span className="ms-1">Empleados</span>
        </NavDropdown.Item>
      </NavDropdown>
      {/* AJUSTES */}
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
