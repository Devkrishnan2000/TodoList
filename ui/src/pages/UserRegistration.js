import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { createUser } from "../util/apiCalls";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

function UserRegistration() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "1") {
      navigate("/home"); // if user already logged in then redirect to home page
    }
  }, [navigate]);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [repassword, setrepassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      if (password === repassword) {
        const userData = {
          username: username,
          password: password,
          first_name: firstname,
          last_name: lastname,
        };
        registerUser(userData);
      }
    }

    setValidated(true);
  };
  const registerUser = async (userData) => {
    const result = await createUser(userData);
    if (result.status) {
      setFirstname("");
      setLastname("");
      setUsername("");
      setpassword("");
      setrepassword("");
      setValidated(false);
      handleShow();
    } else {
      console.log(result);
      if (
        result.data.response.data.data ===
        "{'username': [ErrorDetail(string='user with this username already exists.', code='unique')]}"
      ) {
        alert("User Already Exist's");
      } else {
        alert(result.data.response.data.data);
      }
    }
  };
  return (
    <Container className="mt-5">
      <h1 className="mb-5">Create New Account</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              pattern="^[A-Za-z\s]+$"
              type="text"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              placeholder="First name"
            />
            <Form.Control.Feedback type="invalid">
              First name is invalid
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              pattern="^[A-Za-z\s]+$"
              placeholder="Last name"
            />
            <Form.Control.Feedback type="invalid">
              Last name is invalid
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} md="4" controlId="validationEmail">
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a valid username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                aria-describedby="inputGroupPrepend"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a valid password.
              </Form.Control.Feedback>
              <InputGroup.Text
                id="inputGroupPrepend"
                onClick={() => {
                  showPassword ? setShowPassword(false) : setShowPassword(true);
                }}
              >
                {showPassword ? <EyeSlash></EyeSlash> : <Eye></Eye>}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationPassword">
            <Form.Label> Renter Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                placeholder="Renter Password"
                value={repassword}
                onChange={(e) => {
                  setrepassword(e.target.value);
                }}
                required
                isInvalid={password !== repassword}
              />
              <Form.Control.Feedback type="invalid">
                Password doesn't match.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Button type="submit" className="mt-3">
          Create Account
        </Button>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>Now you can login as the new user</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              navigate("/");
            }}
          >
            Redirect to login Page
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default UserRegistration;
