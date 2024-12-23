import Send from './Send'
import Verify from './Verify'
import OTPVerification  from './Mail'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/send-otp" element={<Send/>}/>
      <Route path="/verify-otp" element={<Verify/>}/>
      <Route path="/" element={<OTPVerification />}/>
    </Routes>
    </BrowserRouter>
  
  )
}

export default App;
