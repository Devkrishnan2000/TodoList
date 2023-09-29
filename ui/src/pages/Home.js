import TaskCard from "../components/TaskCard";
import { useEffect,useState } from "react";
import { displayTasks } from "../util/apiCalls";
import { Button, Col } from "react-bootstrap";
import TaskModal from "../components/TaskModal";
import Pagination from "react-bootstrap/Pagination";
import Dropdown from "react-bootstrap/Dropdown";
import { Pencil } from "react-bootstrap-icons";
import AOS from 'aos';
import 'aos/dist/aos.css';
function Home() {
  const [taskList, setTaskList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // total number of pages from django rest paginator
  const [curPage, setcurPage] = useState(1); // to keep track of current page
  const [taskstatus,setTaskStatus] = useState(undefined) // to keep track of task status 
  const [statusName,setStatusName] = useState("View All")
  const [reload,setreload] = useState(0)

  useEffect(() => {
    AOS.init();
    getTasks(1); // load the first page of tasks
  }, [reload,]);

  const getTasks = async (curPage, taskStatus) => {
    console.log(taskStatus)
    let result = await displayTasks(curPage, taskStatus);
    if (result.status) {
      setTaskList(result.data.tasks);
      setTotalPages(result.data.pages);
      setcurPage(curPage);
      if(taskStatus===undefined)
      { // while calling create task task status is set to view all
        setStatusName("View All")
        setTaskStatus(taskStatus)
      }
      // prints log
      console.log(result);
    } 
    else 
    {
      if (result.data.length===0) {
        // if list is empty sets tasklist empty
        console.log(result.data);
        setTaskList([]);
      } 
      else if (result.data.response.status === 404 && result.data.response.data.detail === "Invalid page.") {
        setcurPage(curPage - 1); // set's current page to previous page
        setreload(curPage-1);  // reloads previous page if current page is invalid
      }
      console.log(result)
    }
  };

  const generatePaginator = (pages) => {
    let pageItem = [];
    for (let i = 1; i <= pages; ++i) {
      pageItem.push(
        <Pagination.Item 
          key={i}
          active={i === curPage}
          onClick={() => {
            getTasks(i,taskstatus);
          }}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pageItem;
  };

  return (
    <div className="m-3">
      <div className="d-flex align-items-center">
        <Button
          className="m-3 text-light"
          onClick={() => {
            setModalShow(true);
          }}
        >
          <Pencil className="me-2"></Pencil>
          Create Task
        </Button>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {statusName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setTaskStatus("False")
                getTasks(1, "False");
                setStatusName("View Pending")
              }}
            >
              Pending
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setTaskStatus("True")
                getTasks(1, "True");
                setStatusName("View Completed")
              }}
            >
              Completed
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setTaskStatus(undefined)
                getTasks(1);
                setStatusName("View All")
              }}
            >
              All
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="row">
        {taskList ? ( //checks if tasklist empty or not
          taskList.length > 0 ? (
            taskList.map((task) => (
              <Col key={task.id} data-aos="zoom-in">
                <TaskCard
                  key={task.id}
                  task={task}
                  curPage={curPage}
                  reloadTask={getTasks}
                  task_status={taskstatus}
                ></TaskCard>
              </Col>
            ))
          ) : (
            <h2 className="m-3">Task List Empty !</h2>
          )
        ) : (
          <img
            style={{ width: "500px", height: "500px" }}
            src="not_found.png"
            alt="list Empty"
          ></img>
        )}
      </div>
      <TaskModal
        show={modalShow}
        operation={true} //false for update operation
        curPage={curPage}
        reloadTask={getTasks}
        onHide={() => setModalShow(false)}
      />
      <div></div>
      <Pagination
        size="md"
        style={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination.First
          onClick={() => {
            getTasks(1,taskstatus); // get the first page
          }}
        />
        <Pagination.Prev
          onClick={() => {
            curPage > 1 && getTasks(curPage - 1,taskstatus); //only get tasks if page number is atleast 1
          }}
        />
        {generatePaginator(totalPages)}
        <Pagination.Next
          onClick={() => {
            curPage < totalPages && getTasks(curPage + 1,taskstatus); //only get tasks if page number less than total page numbers
          }}
        />
        <Pagination.Last
          onClick={() => {
            getTasks(totalPages,taskstatus); // get the last page
          }}
        />
      </Pagination>
    </div>
  );
}
export default Home;
