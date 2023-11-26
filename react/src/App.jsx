import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import svg from './assets/bitmap.svg'
import toolSvg from './assets/tools.svg'
// import homeSvg from './assets/home.svg'
import google from './assets/google.jpeg'
import rating from './assets/rating.jpeg'
import homeSvg from '../../../../Desktop/sOl2Zg01.svg'
import recycle from '../../../../Desktop/re.svg'
import truck from '../../../../Desktop/untitled2-c.png'
import junk from '../../../../Desktop/junk1-c.png'
import assembly from '../../../../Desktop/tools-c.png'
import underline from '../../../../Desktop/underline.svg'

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
        <li>
          <label>enter address<input type='text'/></label>
        </li>
        <li>
          <label>select a service<input type='text'/></label>
        </li>
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
const PricingButton=()=>{
  const navigate = useNavigate();
  return(
    <div style={{display:'flex', justifyContent:'center'}}>
      <button onClick={()=>navigate('/pricing')} className='primaryBtn'>
        <div className='buttonContents'>
          Instant Pricing <Arrow/>
        </div>
      </button>
    </div>
  )
}
const Carousel=()=>{
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselItems = [
    {icon: truck, text: 'Moving Services'},
    {icon: junk, text: 'Junk Removal'}, 
    {icon: assembly, text: 'Item Assembly'}
  ];
  const handlePrev=()=>{
    carouselItems[carouselIndex-1]
    ? setCarouselIndex(carouselIndex-1) 
    : setCarouselIndex(carouselItems.length-1);
    animate()
  }
  const handleNext=()=>{
    carouselItems[carouselIndex+1]
    ? setCarouselIndex(carouselIndex+1) 
    : setCarouselIndex(0);
    animate()
  }
  const animate=()=>{
    const images = document.querySelectorAll('.carouselImage')
    for (const currentImg of images){
      currentImg.classList.remove('swipe')
      currentImg.offsetWidth;
      currentImg.classList.add('swipe')
    }
  }
  return(
    <div className='carouselContainer'> 
      <h2>What We Offer</h2> 
      <p className='description'>We do it all! Whether you need help moving or getting rid of junk, we've got you covered. Check out our most popular options below.</p>
      <div className='flexH'>
        {/* <div className='icons'><img src={homeSvg} style={{width:'6vw'}}/></div> */}
        <div className='mainCard'>
          <img src={carouselItems[carouselIndex-1] ? carouselItems[carouselIndex-1].icon : carouselItems[carouselItems.length-1].icon} style={{width:'15vw', height:'9vw'}} className='carouselImage' onClick={handlePrev}/>
        </div>
        <div className='mainCard'>
          <img src={carouselItems[carouselIndex].icon} style={{width:'30vw', height:'18vw'}} className='carouselImage'/>
          <div>{carouselItems[carouselIndex].text}</div>
        </div>
        <div className='mainCard'>
          <img src={carouselItems[carouselIndex+1] ? carouselItems[carouselIndex+1].icon : carouselItems[0].icon} style={{width:'15vw', height:'9vw'}} className='carouselImage' onClick={handleNext}/>
        </div>
        {/* <div className="icons"><img src={recycle} style={{width:'6vw'}}/></div> */}
      </div>
      <div className="flexH">
      <button className="nextButton primaryBtn flipped" onClick={handlePrev}>
        <Arrow/>
      </button>
      <ul className='carouselDots'>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <button className="nextButton primaryBtn" onClick={handleNext}>
        <Arrow/>
      </button>
      </div>
      <PricingButton/>
    </div>
  )
}
const HomePage=()=>{
  const navigate = useNavigate();
    return(
      <div className='all'>
        <div className='mainContainer'>
          <h1>
            <span>Let's</span><span>get</span><span>moving</span>!
          </h1>
          <img src={underline} style={{maxWidth:'95vw', transform:'scaleY(-0.7)', marginBottom:'-1rem', minWidth:'60vw'}}/>
        </div>
        <Carousel/>
        <div>reviews</div>
        <div className="flexH review">
          <img src={google} style={{width:'20vw', maxWidth:'10rem'}}/>
          5 stars on google
          <img src={rating} style={{width:'20vw', maxWidth:'10rem'}}/>
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
