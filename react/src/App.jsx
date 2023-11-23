import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import svg from './assets/bitmap.svg'
import toolSvg from './assets/tools.svg'
import homeSvg from './assets/home.svg'
import google from './assets/google.jpeg'
import rating from './assets/rating.jpeg'
import truck from '../../../../Desktop/untitled2.png'

import './App.css'
import {Nav, Arrow} from './components/svg'


const Header=({sidebar, showSidebar})=>{
  const navigate = useNavigate();
  return(
    <div className='header'>
      <div onClick={()=>navigate('/')}>
        <div className='flexH'>
          <img src={svg} style={{width:'3rem', height:'3rem'}}/>
          <div>Orbit</div>
        </div>
      </div>
      <div>Contact</div>
      <div>About</div>
      <Nav sidebar={sidebar} showSidebar={showSidebar}/>
    </div>
  )
}
export const Sidebar=()=>{
  const navigate = useNavigate();
  return(
    <div className='sidebarContents'>
        <div onClick={()=>navigate('/')}>Home</div>
    </div>
  )
}
const Layout=({children})=>{
  const [sidebar, showSidebar] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 
  return(
    <div className='layout'>
      <Header sidebar={sidebar} showSidebar={showSidebar}/>
      <div className={`sidebar ${!sidebar ? 'slide' : ''}`}>
        {sidebar && <Sidebar />}
      </div>
      {/* <Nav /> */}
        <div className='all'>
          {children}
        </div>
    </div>
  )
}
const PricingPage=()=>{
  return(
    <form>
      <ol>
        <li>enter address</li>
        <li>select a service</li>
        <li>choose a date</li>
        {/* backend call to see which dates/times are available */}
        <li>contact info</li>
        <li>confirm details + payment</li>
        <li>submit</li>
        <li>running price sticky at bottom</li>
      </ol>
    </form>
  )
}
const HomePage=()=>{
  const navigate = useNavigate();
    return(
      <div className='all'>
        <div className='mainContainer'>
        <h1>
          Let's get things moving!
        </h1>
        <img src={truck} style={{width:'50vw', height:'30vw'}}/>

          {/* <div className='mainCard'>
            <div style={{display:'flex', width:'100%'}}>
              <div style={{display:'flex', background:'white', maxHeight:'10vh'}}> */}
                {/* <img src={google}/>
                <div>4.5</div>
                <img src={rating}/> */}
              {/* </div>
            </div>
            <div className='description'>We do it all! From moving services to junk removal, we are ready to assist you with your needs. </div>
          </div> */}
        </div>
        <div style={{display:'flex', justifyContent:'center'}}>
          <button onClick={()=>navigate('/pricing')} className='primaryBtn'>
            <div className='buttonContents'>
              Instant Pricing <Arrow/>
            </div>
          </button>
        </div>
        <div>reviews</div>
        <div className='serviceCards'>
          <div>
          <div>
            <img src={homeSvg} style={{width:'10rem'}}/>
          </div>
          <div className='flexH'>
            <div>Small Moves</div>
            <Arrow/>
          </div>
          </div>
          <div>
            <div>
              <img src={toolSvg} style={{width:'10rem'}}/>
            </div>
            <div className='flexH'>
              <div>Large Moves</div>
              <Arrow/>
            </div>
          </div>
          <div>
            <div className='flexH'>
              <div>Junk Removal</div>
              <Arrow/>
            </div>
          </div>
          <div>
          <div>
            <img src={toolSvg} style={{width:'10rem'}}/>
          </div>
            <div className='flexH'>
              <div>Product Assembly</div>
              <Arrow/>
            </div>
          </div>
        </div>
      </div>
    )
}
function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/pricing' element={<PricingPage/>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
