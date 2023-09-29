import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { createTask, updateTask } from "../util/apiCalls";

function TaskModal(props) {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      if (props.operation) {
        //if true performs create operation else update
        performCreate();
      } else {
        performUpdate();
      }
    }

    setValidated(true);
  };

  const performUpdate = async () => {
    const updateTaskDetails = {
      task_name: taskName,
      task_desc: taskDesc,
      version: props.task.version,
    };
    let result = await updateTask(props.task.id, updateTaskDetails);
    if (result.status) {
      props.reloadTask(props.curPage,props.task_status); //reloads tasks and displays current page
      clearForm();
      props.onHide(); //hides the modal
    } else if (result.data === "Version Mismatch!") {
      alert("Version misnatch please try again");
      props.reloadTask(props.curPage,props.task_status); //reloads tasks and displays current page
      clearForm();
      props.onHide();
    } else alert(result.data);
  };
  const clearForm = () => {
    setTaskName("");
    setTaskDesc("");
    setValidated(false);
  };
  const performCreate = async () => {
    const createTaskDetails = {
      task_name: taskName,
      task_desc: taskDesc,
    };
    let result = await createTask(createTaskDetails);
    if (result.status) {
      props.reloadTask(1); //reloads tasks and displays first page
      props.onHide(); //hides the modal
      clearForm();
    } else {
      alert(result.data);
    }
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.operation //heading based on type of operation(create/update)
            ? "Create Task"
            : "Update Task"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          id="taskForm"
          noValidate
          validated={validated}
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your task name"
              value={taskName}
              pattern="[A-Za-z0-9\s]+"
              onChange={(e) => {
                setTaskName(e.target.value);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Task Name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Task description"
              pattern="[A-Za-z0-9\s]+"
              value={taskDesc}
              onChange={(e) => {
                setTaskDesc(e.target.value);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Task Description.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default TaskModal;
