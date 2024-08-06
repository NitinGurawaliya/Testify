import { Component, useState } from 'react'
import {BrowserRouter,Navigate,Route,Routes} from "react-router-dom"
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import CreateTestForm from './pages/Createcourse'
import StartTest from './pages/Starttest'
import UserDashboard from './pages/Userhome'
import AdminDashboard from './pages/AdminHome'
import TestDetail from './pages/TestDetail'

const getUserRole = ()=>{
  return localStorage.getItem("userRole")
}

const UserRoute=({ element: Component, ...rest })=>{
const role = getUserRole();
return role == "user" ? <Component {... rest}   /> :<Navigate  to={"/userDashboard"} replace state={{ error: "You cannot access this route" }} />
}


const AdminRoute=({ element: Component, ...rest })=>{
  const role = getUserRole();
  return role == "admin" ? <Component {... rest}   /> :<Navigate  to={"/adminDashboard"} replace state={{ error: "You cannot access this route" }} />
  }


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup />} /> 
      <Route path='/signin' element={<Signin />} /> 


      <Route path='/userDashboard' element={<UserRoute element={UserDashboard} />} />
      <Route path='/start' element={<UserRoute element={StartTest}/>} /> 


      <Route path='/adminDashboard' element={<AdminRoute element={AdminDashboard}  />} />
      <Route path='/createcourse' element={<AdminRoute element={CreateTestForm}  />} /> 
      <Route path="/admin/test/:testId" element={<AdminRoute element={TestDetail}   />} />


    </Routes>

    </BrowserRouter>

    </>
  )
}

export default App
