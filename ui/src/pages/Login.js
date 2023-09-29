import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../util/apiCalls";
import Modal from "react-bootstrap/Modal";
import { Container, Card, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "1") {
      navigate("/home"); // if user already logged in then redirect to home page
    }
  }, [navigate]);

  const authenicateUser = async () => {
    const userCredentials = {
      username: username,
      password: password,
    };
    const loginSucess = await login(userCredentials);
    if (loginSucess) {
      localStorage.setItem("loggedIn", "1"); // sets user is logged in
      navigate("/home");
    } else {
      handleShow();
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      authenicateUser();
    }
    setValidated(true);
  };
  return (
    <Container className="w-25">
      <h1 className="mt-5" style={{ textAlign: "center" }}>
        LOGIN
      </h1>
      <Card className="d-flex justify-content-center">
        <Form
          noValidate
          validated={validated}
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="m-5  rounded"
        >
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter username"
              value={username.value}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Form.Text className="text-muted"></Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid Username.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password.value}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
             
              <InputGroup.Text
                id="basic-addon1"
                onClick={() => {
                  showPassword ? setShowPassword(false) : setShowPassword(true);
                }}
                
              >
                {showPassword ? <EyeSlash></EyeSlash> : <Eye></Eye>}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                Please provide a valid Password.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Button
            variant="primary"
            className="d-block mb-2 text-light"
            type="submit"
          >
            Submit
          </Button>
          <Link to="/register">New ? Create an Account</Link>
        </Form>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Incorrect User Credentials</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-danger">
          Your username or password is Incorrect
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default Login;
