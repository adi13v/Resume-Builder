import "react-image-crop/dist/ReactCrop.css";
import { Routes,Route} from 'react-router-dom'
import JakeResume from './pages/jakesResume'
import ResumeWithPhoto from './pages/resumewithPhoto'
import HomePage from './pages/HomePage'
import Header from './components/Header'
import NitResume from './pages/nitResume'
import './App.css'
import { NITEnum } from './helper/helperFunctions'
import NotFoundPage from './pages/notExists'
function App() {
  return (
    <>
     <div className='w-full'>
     <Header />
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/jake' element={<JakeResume defaultGradeSetting={true} />} />
        <Route path='/jake-no-grade' element={<JakeResume defaultGradeSetting={false} />} />
        <Route path='/photo-disabled' element={<ResumeWithPhoto defaultPhotoSetting={false} />} />
        <Route path='/photo' element={<ResumeWithPhoto defaultPhotoSetting={true} />} />
        <Route path='/nit-with-logo' element={<NitResume  defaultPhotoSetting = {NITEnum.Logo}/>} />
        <Route path='/nit-with-photo' element={<NitResume defaultPhotoSetting = {NITEnum.Photo}/>} />
        <Route path='/nit-without-photo' element={<NitResume defaultPhotoSetting = {NITEnum.None}/>} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
     </div>
     
    </>
  )
}

export default App