import { axiosApi } from "../api/axiosApi";

export async function displayTasks(page, taskStatus) {
  // task status expected value for view all : undefined
  // task status expected value for pending : false
  // task status expected value for completed : true
  let status;
  let data;
  let url;
  if (taskStatus !== undefined) {
    url = `todolist/view-tasks/?page=${page}&status=${taskStatus}`;
  } else {
    url = `todolist/view-tasks/?page=${page}`;
  }
  await axiosApi
    .get(url)
    .then((result) => {
      if (result.data.message === "List Empty !") {
        status = false;
        data = [];
        console.log(status);
      } else {
        status = true;
        data = result.data.data;
        console.log(result);
      }
    })
    .catch(function (error) {
      status = false;
      data = error;
    });
  return {
    status: status,
    data: data,
  };
}
export async function updateTask(taskId, taskDetails) {
  let status;
  let data;
  await axiosApi
    .put("todolist/update-task/" + taskId + "/", taskDetails)
    .then((result) => {
      if (result.data) {
        status = true;
        data = "Task Updated Successfully";
      }
    })
    .catch(function (error) {
      console.log(JSON.stringify(error));

      if (error.response.status === 400) {
        status = false;
        data = "Input not in correct format";
      } else if (error.response.status === 409) {
        console.log(error.response.data);
        status = false;
        data = error.response.data;
      }
    });
  return {
    status: status,
    data: data,
  };
}

export async function createTask(taskDetails) {
  let status;
  let data;
  await axiosApi
    .post("todolist/create-task/", taskDetails)
    .then((result) => {
      if (result.data) {
        status = true;
        data = "Task Created Successfully";
      }
    })
    .catch(function (error) {
      console.log(error);
      if (error.response.status === 400) {
        console.log()
        status = false;
        data = error?.response?.data?.error[0][1][0];
      } 
    });

  return {
    status: status,
    data: data,
  };
}

export async function closeTask(taskId) {
  let status;
  let data;
  await axiosApi
    .put("todolist/close-task/" + taskId + "/")
    .then((result) => {
      status = true;
      data = result.data;
    })
    .catch(function (error) {
      status = false;
      data = error;
    });

  return {
    status: status,
    data: data,
  };
}

export async function deleteTask(taskId) {
  let status;
  let data;
  await axiosApi
    .delete("todolist/delete-task/" + taskId + "/")
    .then((result) => {
      status = true;
      data = result.data;
    })
    .catch(function (error) {
      status = false;
      data = error;
    });

  return {
    status: status,
    data: data,
  };
}

export async function getAcessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  let access_token;
  const body = {
    refresh: refreshToken,
  };
  await axiosApi
    .post("login/refresh/", body)
    .then((result) => {
      access_token = result.data.access;
    })
    .catch(function (error) {
      console.log(error);
    });
  return access_token;
}

export async function login(userCredentials) {
  let status;
  await axiosApi
    .post("login/", userCredentials)
    .then((result) => {
      localStorage.setItem("refresh_token", result.data.refresh);
      sessionStorage.setItem("access_token", result.data.access);
      status = true;
    })
    .catch(function (error) {
      status = false;
      console.log(error);
    });
  return status;
}
export async function createUser(userdata) {
  let status;
  let data;
  await axiosApi
    .post("user/register/", userdata)
    .then((result) => {
      status = true;
      data = result.data.message;
    })
    .catch(function (error) {
      status = false;
      data = error;
      console.log(error.response.data.data);
    });
  return {
    status: status,
    data: data,
  };
}

export async function getUserDetails() {
  let status;
  let data;
  await axiosApi
    .get("user/userdetails/")
    .then((result) => {
      status = true;
      data = result.data;
    })
    .catch(function (error) {
      status = false;
      data = error;
      console.log(error);
    });
  return {
    status: status,
    data: data,
  };
}

export function toLocalDate(epochTime) {
  let d = new Date(epochTime * 1000);
  return d.toLocaleString();
}
