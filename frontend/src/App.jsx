import { useState } from 'react'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import CreateTestForm from './pages/Createcourse'
import StartTest from './pages/Starttest'
import UserDashboard from './pages/Userhome'
import AdminDashboard from './pages/AdminHome'



function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup />} /> 
      <Route path='/signin' element={<Signin />} /> 
      <Route path='/userDashboard' element={<UserDashboard />} />
      <Route path='/adminDashboard' element={<AdminDashboard />} />
      <Route path='/createcourse' element={<CreateTestForm />} /> 
      <Route path='/start' element={<StartTest />} /> 

    </Routes>

    </BrowserRouter>

    </>
  )
}

export default App
