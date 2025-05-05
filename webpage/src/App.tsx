import React from 'react'
import "react-image-crop/dist/ReactCrop.css";
import { Routes,Route,Link} from 'react-router-dom'
import JakeResume from './pages/jakesResume'
import ResumeWithPhoto from './pages/resumewithPhoto'
import HomePage from './pages/HomePage'
import Header from './components/Header'
import './App.css'

function App() {
  
  return (
    <>
     <div className='w-full'>
     <Header />
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/jake' element={<JakeResume />} />
        <Route path='/photo' element={<ResumeWithPhoto />} />
      </Routes>
     </div>
     
    </>
  )
}

export default App