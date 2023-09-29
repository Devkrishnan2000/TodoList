import { useEffect, useState } from "react";
import { Button, NavLink } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { getUserDetails } from "../util/apiCalls";
// navbar component
function TodoNav() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      navigate("/"); // if user not  logged in then redirect to login
    } else {
      setName();
    }
  });
  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };
  const setName = async () => {
    const userdetails = await getUserDetails();
    console.log(userdetails.data);
    setUsername(userdetails.data.first_name + " " + userdetails.data.last_name);
  };
  return (
    <div>
      <Navbar expand="lg" className="bg-primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand to="/">TodoList</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavLink className="ms-auto text-light">Hello, {username}</NavLink>
            <Button
              variant="dark"
              className="ms-3"
              onClick={() => {
                logout();
              }}
            >
              Log out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}
export default TodoNav;
