import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TodoNav from "./components/TodoNav";
import Login from "./pages/Login";
import { useEffect } from "react";
import UserRegistration from "./pages/UserRegistration";

function App() {
  useEffect(()=>{
    // to set dark mode
    // document.body.classList.add("bg-dark")
    // document.body.classList.add("text-light")
    // document.body.setAttribute('data-bs-theme','dark')
  })
  return (
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/register" element={<UserRegistration/>}></Route>
      <Route path="/home" element={<TodoNav/>}>
        <Route path="/home" element={<Home/>}/>
      </Route>
    </Routes>
  );
}

export default App;
