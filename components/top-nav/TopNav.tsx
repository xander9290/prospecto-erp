"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function TopNav() {
  const { data: session } = useSession();
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="sticky-top">
      <Container>
        <Navbar.Brand as={Link} href="/app">
          ERP LEAD
        </Navbar.Brand>
        <Navbar.Collapse />
        <Nav className="me-auto"></Nav>
        <Nav>
          <NavDropdown
            title={
              <>
                <i className="bi bi-person-circle me-2"></i>
                <span className="text-capitalize">{session?.user?.name}</span>
              </>
            }
            className="text-capitalize"
          >
            <NavDropdown.Item as={Link} href={`/app/user/${session?.user?.id}`}>
              mi perfil
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => signOut()} href="#">
              cerrar sesión
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default TopNav;
