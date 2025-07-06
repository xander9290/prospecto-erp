"use client";

import { setUserDarkMode } from "@/app/actions/user-actions";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function TopNav() {
  const { data: session } = useSession();

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = async () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "light" : "dark"
    );
    await setUserDarkMode(!darkMode);
  };

  useEffect(() => {
    const darkMode: boolean = session?.user.darkMode ?? false;
    setDarkMode(darkMode);
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );
  }, [session]);

  return (
    <Navbar expand="lg" className="sticky-top bg-body-tertiary">
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
            <NavDropdown.Item
              as={Link}
              href={`/app/profile/${session?.user?.id}`}
            >
              mi perfil
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => signOut()} href="#">
              cerrar sesión
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav.Item className="ms-2">
          <Button
            variant={darkMode ? "light" : "dark"}
            onClick={toggleDarkMode}
            size="sm"
          >
            {darkMode ? (
              <i className="bi bi-sun-fill"></i>
            ) : (
              <i className="bi bi-moon-stars-fill"></i>
            )}
          </Button>
        </Nav.Item>
      </Container>
    </Navbar>
  );
}

export default TopNav;
