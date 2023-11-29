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
import services from './functions/frontRequests'
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
  // const [disabledDates, setDisabledDates] = useState([]);
  const dateInputRef = useRef(null);
  let today = new Date();
  today = new Date(today.getTime() - 8*60 * 60 * 1000)
  today = today.toISOString().slice(0,10);
  
  useEffect(() => {
    services.getDates().then(re=>{
      const dates = re.data.map(date=>date.date)
      flatpickr(dateInputRef.current, {
        disable: [{ from: '1900-01-01', to: today}, '2023-12-24', '2023-12-25', '2024-01-01', ...dates], 
        dateFormat: 'Y-m-d',
      });
    })
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
const EmployeeForm=()=>{

}
const EmployeePage=()=>{

}
const SchedulePage=()=>{
  const [appts, setAppts]=useState([]);
  const columns=['date', 'time', 'name', 'phone', 'service', 'address', 'destination'];
  useEffect(()=>{
    services.cleanSchedule().then(()=>{
      services.getSchedule().then(re=>{
        setAppts(re.data.rows)
      })
    })
  }, []);
  return(
    <div className='scrollTable'>
      <table>
        <thead>
          <tr>
            {columns.map((column, i)=>(
              <th key={i}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appts.map((appt, i)=>(
            <tr key={i}>
              {columns.map((column, i)=>(
                <td key={i}>{appt[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
const PricingPage=()=>{
  const [address, setAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState(null);
  const [total, setTotal] = useState(0);
  const [moving, setMoving] = useState(null);
  const [email, setEmail] = useState('');
  const [junk, setJunk] = useState(null);
  const [misc, setMisc] = useState(null);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    // await services.postMessage();
    await services.addToSchedule({address, service, date, name, phone, email, time, destination});
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
            <SelectOptions setMoving={setMoving} setJunk={setJunk} setMisc={setMisc}/>
          </label>
        </li>
        <li>
          <label>
            enter address
            <Address setAddress={setAddress} address={address}/>
          </label>
        </li>
        {moving && <li>
          <label>
            enter destination
            <Address setAddress={setDestination} address={destination} setDistance={setDistance} origin={address}/>
          </label>
        </li>}
        <li>
          <label>
            choose a date
            <DateInput date={date} setDate={setDate}/>
          </label>
        </li>
        <li>
          <label>
            select a time
            <input type='time'/>
          </label>
        </li>
        {/* backend call to see which dates/times are available */}
        <li>
          <fieldset>
            <legend>contact info</legend>
            <label>Name: <input type='text' autoComplete='off' value={name} onChange={(e)=>setName(e.target.value)} required/></label>
            <br/>
            <label>Phone Number: <input type='tel' value={phone} onChange={(e)=>setPhone(e.target.value)}required/></label>
            <br/>
            <label>Email: <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)}required/></label>
          </fieldset>
        </li>
        <li>confirm details + payment</li>
        <button type='submit' onClick={handleSubmit}>submit</button>
        <li>running price sticky at bottom</li>
      </ol>
    </form>
  )
}
const Address=({address, setAddress, setDistance, origin})=>{
  const handleSelect=async(addy)=>{
    setAddress(addy);
    // if this is the destination input
    if (setDistance){
      const re = await services.calcDistance(origin, addy);
      setDistance(re.data.rows[0].elements[0].distance.text);
    }
  }
  return(
    <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
            <input
              {...getInputProps({
                placeholder: 'Enter your address',
                className: 'address-input',
              })}
            />
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
const SelectOptions=({setMoving, setJunk, setMisc})=>{
  return(
    <ol className='select'>
      <li>
        <button onClick={()=>setMoving(true)}>moving</button>
      </li>
      <li>
        <button onClick={()=>setJunk(true)}>junk removal</button>
      </li>
      <li>
        <button onClick={()=>setMisc(true)}>other</button>
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
          <Route path='/sched' element={<SchedulePage/>} />
          <Route path='/pricing' element={<PricingPage/>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
