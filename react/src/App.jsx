import { useState, useEffect, useRef } from 'react'
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
import PlacesAutocomplete from 'react-places-autocomplete'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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
const DateInput = ({date, setDate}) => {
  const dateInputRef = useRef(null);
  let today = new Date();
  today = new Date(today.getTime() - 8*60 * 60 * 1000)
  today = today.toISOString().slice(0,10);
  
  useEffect(() => {
    flatpickr(dateInputRef.current, {
      disable: [{ from: '1900-01-01', to: today}, '2023-12-24', '2023-12-25', '2024-01-01'], 
      dateFormat: 'Y-m-d',
    });
  }, []);

  return (
    <input
      type="text"
      placeholder="Select a date"
      ref={dateInputRef}
      onInput={()=>setDate(dateInputRef.current.value)}
    />
  );
};
const PricingPage=()=>{
  const [address, setAddress] = useState('');
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [total, setTotal] = useState(0);
  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(address, service, date, name, phone, total)
  }
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return(
    <form>
      <ol>
        <li>
          <label>
            select a service
            <SelectOptions/>
          </label>
        </li>
        <li>
          <label>
            enter address
            <Address setAddress={setAddress} address={address}/>
          </label>
        </li>
        <li>
          <label>
            choose a date
            <DateInput date={date} setDate={setDate}/>
          </label>
        </li>
        {/* backend call to see which dates/times are available */}
        <li>
          <fieldset>
            <legend>contact info</legend>
            <label>Name: <input type='text' autoComplete='off' value={name} onChange={(e)=>setName(e.target.value)} required/></label>
            <br/>
            <label>Phone Number: <input type='tel' value={phone} onChange={(e)=>setPhone(e.target.value)}required/></label>
          </fieldset>
        </li>
        <li>confirm details + payment</li>
        <button type='submit' onClick={handleSubmit}>submit</button>
        <li>running price sticky at bottom</li>
      </ol>
    </form>
  )
}
const Address=({address, setAddress})=>{
  return(
    <PlacesAutocomplete value={address} onChange={setAddress} onSelect={(addy)=>setAddress(addy)}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <label>Enter Address 
            <input
              {...getInputProps({
                placeholder: 'Enter your address',
                className: 'address-input',
              })}
            />
          </label>
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => (
              <div key={suggestion.placeId} {...getSuggestionItemProps(suggestion)}>
                {suggestion.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
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
  return(
    <div className='carouselParent'> 
      <h2>What We Offer</h2> 
      <p className='description'>We do it all! Whether you need help moving or getting rid of junk, we've got you covered. Check out our most popular options below.</p>
      <CarouselContainer/>
      <PricingButton/>
    </div>
  )
}
const CarouselContainer=()=>{
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselItems = [
    {icon: truck, text: 'Moving Services'},
    {icon: junk, text: 'Junk Removal'}, 
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
        <div className='mainCard'>
          <img src={carouselItems[carouselIndex-1] ? carouselItems[carouselIndex-1].icon : carouselItems[carouselItems.length-1].icon} className='carouselImage' onClick={handlePrev}/>
        </div>
        <div className='mainCard'>
          <img src={carouselItems[carouselIndex].icon} className='carouselImage'/>
          <div>{carouselItems[carouselIndex].text}</div>
        </div>
        <div className='mainCard'>
          <img src={carouselItems[carouselIndex+1] ? carouselItems[carouselIndex+1].icon : carouselItems[0].icon} className='carouselImage' onClick={handleNext}/>
        </div>
      </div>
      <div className="flexH" style={{marginTop:'1rem'}}>
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
    </div>
  )
}
const SelectOptions=()=>{
  return(
    <ol className='select'>
      <li>
        <button>moving</button>
      </li>
      <li>
        <button>junk removal</button>
      </li>
      <li>
        <button>other</button>
      </li>
    </ol>
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
