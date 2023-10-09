import { useEffect, useState } from "react";
import { Button, NavLink, OverlayTrigger, Tooltip } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { getUserDetails } from "../util/apiCalls";
import { BoxArrowLeft, Gear } from "react-bootstrap-icons";
// navbar component
function TodoNav() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const renderLogoutTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Logout
    </Tooltip>
  );
  const renderSettingsTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Settings
    </Tooltip>
  );

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
    setUsername(userdetails.data.first_name);
  };
  return (
    <div>
      <Navbar expand="lg" className="bg-primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand to="/">TodoList</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavLink className="ms-auto text-light">Hello, {username}</NavLink>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderLogoutTooltip}
            >
              <Button
                variant="dark"
                className="ms-3"
                onClick={() => {
                  logout();
                }}
              >
                <BoxArrowLeft></BoxArrowLeft>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderSettingsTooltip}
            >
              <Button variant="dark" className="ms-3" onClick={() => {}}>
                <Gear></Gear>
              </Button>
            </OverlayTrigger>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}
export default TodoNav;
