import React from 'react'
import "react-image-crop/dist/ReactCrop.css";
import { Routes,Route,Link} from 'react-router-dom'
import JakeResume from './pages/jakesResume'
import ResumeWithPhoto from './pages/resumewithPhoto'
import HomePage from './pages/HomePage'

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/jake' element={<JakeResume />} />
      <Route path='/photo' element={<ResumeWithPhoto />} />
    </Routes>
    </>
  )
}

export default App