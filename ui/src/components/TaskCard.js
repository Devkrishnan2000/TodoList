import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import TaskModal from "../components/TaskModal";
import { useState } from "react";
import { closeTask, deleteTask, toLocalDate } from "../util/apiCalls";
import Modal from 'react-bootstrap/Modal';
function TaskCard(props) {
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const handlePopupShow = () => setShowPopup(true);
  const setTaskCompleted = async () => {
    let result = await closeTask(props.task.id);
    if (result.status) {
      props.reloadTask(props.curPage,props.task_status);
    } else {
      alert("Error Occured Please Try again later");
      console.log(result);
    }
  };

  const performDelete = async() => {
    let result = await deleteTask(props.task.id);
    if (result.status) {
      props.reloadTask(props.curPage,props.task_status);
    } else {
      alert("Error Occured Please Try again later");
      
    }
  };

  const showStatus = (task_status) => {
    if (task_status)
      return <Card.Text className="text-success">Completed</Card.Text>;
    else return <Card.Text className="text-danger">Pending</Card.Text>;
  };

  return (
    <Card style={{ width: "25rem" }} className="m-3">
      <Card.Body>
        <Card.Title>{props.task.task_name}</Card.Title>
        <Card.Text>{props.task.task_desc}</Card.Text>
        {showStatus(props.task.task_status)}
        <Card.Text>Created On :{toLocalDate(props.task.task_created)}</Card.Text>
        <Card.Text>Last Updated :{toLocalDate(props.task.task_updated)}</Card.Text>
        {!props.task.task_status &&
           <Button variant="success" className="m-1" onClick={setTaskCompleted}>
           Completed
         </Button>
        }
       
        <Button
          variant="warning"
          className="m-1"
          onClick={() => {
            setUpdateModalShow(true);
          }}
        >
          Update
        </Button>
        <Button variant="danger" className="m-1" onClick={handlePopupShow}>
          Delete
        </Button>
      </Card.Body>

      <TaskModal
        show={updateModalShow}
        operation={false} //false for update operation
        task={props.task}
        curPage={props.curPage}
        reloadTask={props.reloadTask}
        task_status={props.task_status}
        onHide={() => setUpdateModalShow(false)}
      />

<Modal show={showPopup} onHide={handlePopupClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you Sure you want to delete this task ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePopupClose}>
            Close
          </Button>
          <Button variant="danger" onClick={performDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
export default TaskCard;
