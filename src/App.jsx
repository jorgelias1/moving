import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import svg from './assets/bitmap.svg'
import toolSvg from './assets/tools.svg'
// import homeSvg from './assets/home.svg'
import google from './assets/google.jpeg'
import rating from './assets/rating.jpeg'
import truck from '../../../Desktop/untitled2-c.png'
import junkIcon from '../../../Desktop/junk1-c.png'
import assembly from '../../../Desktop/tools-c.png'
import services from './functions/frontRequests'
import './App.css'
import {Nav, Arrow} from './components/svg'
import {AdminPage} from './components/admin'
import {PricingPage} from './components/form'

const Header=({sidebar, showSidebar, handleContact})=>{
  const navigate = useNavigate();
  return(
    <div className='header'>
      <div onClick={()=>navigate('/')}>
        <div className='flexH'>
          <img src={svg} className='logo' alt='logo'/>
          <div>Orbit</div>
        </div>
      </div>
      <div onClick={handleContact}>Contact</div>
      {/* <Nav sidebar={sidebar} showSidebar={showSidebar}/> */}
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
  const [msgForm, showMsgForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contact, showContact] = useState(false);
  const handleContact=()=>{
    showContact(true);
    setTimeout(() => {
      showContact(false);
    }, 5000);
  }
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 
  return(
    <div className='layout'>
      <Header sidebar={sidebar} showSidebar={showSidebar} handleContact={handleContact}/>
      <div className={`sidebar ${!sidebar ? 'slide' : ''}`}>
        {sidebar && <Sidebar />}
      </div>
      {contact && <LongMessage msg={'call us today at (123)-456-7890'} type={'success'}/>}
      <div className='all' onClick={()=>showMsgForm(false)}>
        {children}
      </div>
      <div className='questionContainer'>
        {!msgForm
        ? <GotAQuestion showMsgForm={showMsgForm}/>
        : <MsgForm showMsgForm={showMsgForm} setSuccess={setSuccess}/>}
      </div>
    </div>
  )
}
const GotAQuestion=({showMsgForm})=>{
  return(
      <div className='questionForm' onClick={()=>showMsgForm(true)}>Got A Question?
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-10l-9 3-3-3H3c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z"></path>
        </svg>
      </div>
  )
}
const LongMessage=({msg, type})=>{
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false); 
    }, 5000)

    return () => {
      clearTimeout(timer);
    }
  }, []);

  return visible ? (
    <div className={`fade ${type}`} style={{margin:'1rem'}}>{msg}</div>
  ) : null;
}
export const Message=({msg, type})=>{
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false); 
    }, 2000)

    return () => {
      clearTimeout(timer);
    }
  }, []);

  return visible ? (
    <div className={`fade ${type}`}>{msg}</div>
  ) : null;
}
const MsgForm=({showMsgForm, setSuccess})=>{
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [err1, setErr1] = useState(false);
  const [err2, setErr2] = useState(false);
  const [err3, setErr3] = useState(false);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(phone===''){
      setErr1(true);
    } else if(question===''){
      setErr2(true);
    } else{
      try {
        await services.postQuestion(phone, question);
        await services.postMessage(`someone just submitted a question: ${question}`);
        showMsgForm(false);
        setSuccess(true);
      } catch(err){
        setErr3(true);
      }
    }
  }

  return(
    <form className='question'>
      <div className='flexLeft' onClick={()=>showMsgForm(false)}>x</div>
      <div>We'll get back to you as soon as possible!</div>
      <label>
        Phone Number:
        <input className={err1 ? 'error' : ''} type='tel' placeholder='enter phone number' onChange={(e)=>{setPhone(e.target.value); setErr1(false)}} value={phone}/>
        {err1 && 'please enter a valid phone number'}
      </label>
      <label>
        Question:
        <textarea className={err2 ? 'error' : ''} type='text' placeholder='ask anything!' onChange={(e)=>{setQuestion(e.target.value); setErr2(false)}} value={question}/>
        {err2 && 'please do not leave this empty'}
      </label>
      <button type='submit' onClick={handleSubmit}>submit</button>
    </form>
  )
}
const PricingButton=()=>{
  const navigate = useNavigate();
  return(
    <div style={{display:'flex', flexDirection:'column'}}>
      <div className='flexH'>
        <button onClick={()=>navigate('/pricing')} className='primaryBtn'>
          <div className='buttonContents'>
            Instant Pricing <div className='arr'><Arrow/></div>
          </div>
        </button>
      </div>
      <span className="material-symbols-outlined">
        verified_user
        <span>fully insured</span>
      </span>
    </div>
  )
}
const Carousel=()=>{
  return(
    <div className='carouselParent'> 
      {/* <h2>What We Offer</h2>  */}
      <CarouselContainer/>
    </div>
  )
}
const CarouselContainer=()=>{
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselItems = [
    {icon: truck, text: 'Moving Services'},
    {icon: junkIcon, text: 'Junk Removal'}, 
    {icon: assembly, text: 'Item Assembly'}
  ];
  const animate=()=>{
    const images = document.querySelectorAll('.carouselImage')
    for (const currentImg of images){
      currentImg.classList.remove('swipe')
      currentImg.offsetWidth;
      currentImg.classList.add('swipe')
    }
  }
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
  return(
    <div>
      <div className='flexH'>
        <div className='mainCard' onClick={handlePrev}>
          <img src={carouselItems[carouselIndex-1] ? carouselItems[carouselIndex-1].icon : carouselItems[carouselItems.length-1].icon} className='carouselImage' />
        </div>
        <div className='mainCard'>
          <img src={carouselItems[carouselIndex].icon} className='carouselImage'/>
        </div>
        <div className='mainCard' onClick={handleNext}>
          <img src={carouselItems[carouselIndex+1] ? carouselItems[carouselIndex+1].icon : carouselItems[0].icon} className='carouselImage' />
        </div>
      </div>
      <div className='flexH imageDesc'>
        <div>{carouselItems[carouselIndex].text}</div>
      </div>
      <div className="flexH" style={{marginTop:'1rem'}}>
        <button className="nextButton flipped" onClick={handlePrev}>
          <Arrow/>
        </button>
        <ul className='carouselDots'>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <button className="nextButton" onClick={handleNext}>
          <Arrow/>
        </button>
      </div>
    </div>
  )
}
const HomePage=()=>{
  const navigate = useNavigate();
    return(
      <div className='all'>
        <div className='mainContainer'>
          <div className='mainText'>
            <h1>
              <span>Let's</span><span>get</span><span>moving</span>!
            </h1>
            <p className='description'>We do it all! Whether you need help moving or getting rid of junk, we've got you covered. Check out our most popular options below!</p>
          </div>
          <div className="image">
          </div>
        </div>
        <div className='carPrice'>
          <Carousel/>
          <PricingButton/>
        </div>
        <div className='review'>
          <div className="flexH">
            <img src={google} className='reviewImg'/>
            <div style={{marginRight:'auto', marginTop:'auto', marginBottom:'1rem'}}>
              <div>Fernanda</div>
              <img src={rating} className='reviewImg stars'/>
            </div>
            <div style={{marginRight:'auto'}}></div>
          </div>
          "We had an outstanding experience, very attentive and professional at all times. During our move all of our belongings were very well taken care of. Orbit has earned my trust and will definitely hire them next time"
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
          <Route path='/sched' element={<AdminPage/>} />
          <Route path='/pricing' element={<PricingPage/>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
