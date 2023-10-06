import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ErrorModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-danger">{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ErrorModal;
