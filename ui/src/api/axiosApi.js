import axios from "axios";
import { getAcessToken } from "../util/apiCalls";

export const axiosApi = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
});

axiosApi.interceptors.request.use(
  function (config) {
    if (
      config.url === "user/register/" ||
      config.url === "user/login/" ||
      config.url === "user/login-google/"
    ) {
      // no need auth header for registration
      config.headers["Accept"] = `application/json`;
      config.headers["Content-Type"] = `application/x-www-form-urlencoded`;
      return config;
    } else {
      config.headers["Authorization"] = `Bearer ${sessionStorage.getItem(
        "access_token"
      )}`;
      config.headers["Accept"] = `application/json`;
      config.headers["Content-Type"] = `application/x-www-form-urlencoded`;
      return config;
    }
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);
axiosApi.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (
      error.config.url === "login/refresh/" &&
      error.response.status === 401
    ) {
      // if refresh page is getting 401 then refresh token is expired so return to login page
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/");
    } else {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        // tries to get new access token from  exisiting refresh token when access token expires
        originalRequest._retry = true;
        const accessToken = await getAcessToken(); // function to get new access token
        sessionStorage.setItem("access_token", accessToken);
        console.log("Access Token Updated !");
        axiosApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${sessionStorage.getItem("access_token")}`;
        return axiosApi(originalRequest);
      } else if (error.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        if (
          error.response.data.detail ===
          "No active account found with the given credentials"
        ) {
          console.log("login failed");
        } else {
          localStorage.clear();
          sessionStorage.clear();
          window.location.replace("/"); // redirect to login page
        }
      }
    }

    return Promise.reject(error);
  }
);
