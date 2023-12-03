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
import junkIcon from '../../../../Desktop/junk1-c.png'
import assembly from '../../../../Desktop/tools-c.png'
import underline from '../../../../Desktop/underline.svg'
import PlacesAutocomplete from 'react-places-autocomplete'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import services from './functions/frontRequests'
import './App.css'
import {Nav, Arrow} from './components/svg'
import {SignUpForm, LoginForm} from './components/sign-up'
import { getCurrentUser, signUp, signIn, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword } from '@aws-amplify/auth'

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
const AdminPage=()=>{
  const [signIn, showSignIn] = useState(false);

  const checkUser=async()=>{
    try{
      const re = await getCurrentUser();
      showSignIn(false)
      console.log(re)
    } catch(err){
      showSignIn(true);
    }
  }
  useEffect(()=>{
    checkUser();
  }, [])
  return(
    <>
      {signIn 
      ? <LoginForm/>
      : <div className='all'>
          <ScheduleTable/>
          <PastAppts/>
        </div>}
    </>
  )
}
const PastAppts=()=>{
  const [appts, setAppts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const columns=['location', 'service', 'pay'];

  useEffect(()=>{
    services.getPastAppts().then(re=>{
      re.data.rows && setAddresses(re.data.rows.location)
    })
  }, []);
  return(
    <GoogleMap addresses={addresses}/>
  )
}
const GoogleMap=({addresses})=>{
  useEffect(()=>{
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.444660, lng:-122.720306},
      zoom:5
    });
    addresses.forEach(address=>{
      geocodeAddress(address, map)
    })
  }, []);
  const heatmapData=[];
  const geocodeAddress=(address, map)=>{
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({address}, (results, status) => {
      if (status === 'OK') {
        heatmapData.push(results[0].geometry.location);
        updateHeatmap(map, heatmapData);
      } else {
        console.log(status);
      }
    });
  }
  const updateHeatmap=(map, data)=>{
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data, map, 
      dissipating: true,
      maxIntensity:10,
      radius:20
    })
  }
  return <div id='map' className='map'></div>
}
const ScheduleTable=()=>{
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
const GotAQuestion=({showMsgForm})=>{
  return(
      <div className='questionForm' onClick={()=>showMsgForm(true)}>Got A Question?
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-10l-9 3-3-3H3c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z"></path>
        </svg>
      </div>
  )
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
    <form>
      We'll get back to you as soon as possible!
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
const PricingPage=()=>{
  const [address, setAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [total, setTotal] = useState(0);
  const [moving, setMoving] = useState(null);
  const [email, setEmail] = useState('');
  const [junk, setJunk] = useState(null);
  const [misc, setMisc] = useState(null);
  const [medQty, setMedQty] = useState(0);
  const [lgQty, setLgQty] = useState(0);
  const [section, setSection] = useState(0);
  const [msgForm, showMsgForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err1, setErr1] = useState(false);
  const [city, setCity] = useState('');
  const timeOptions = ['6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm']
  const formProgress=[1,2,3]
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if (name==='' || phone==='' || email===''){
      setErr1(true);
      return;
    }
    await services.postMessage(`new appointment for ${date} at ${address}: ${service} service`);
    await services.addPastAppt(city, service, total);
    await services.addToSchedule({address, service, date, name, phone, email, time, destination});
  }
  const handleBack=(e)=>{
    e.preventDefault();
    section>0 && setSection(section-1);
  }
  // console.log(section)
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return(
    <div className='all'>
      <form>
        <ol>
          <li className='progress'>
            {<button onClick={handleBack} className='backBtn'><Arrow/></button>}
            {formProgress.map((num, i)=>
              <div key={i} className={i<=section ? 'currentNum' : ''}>{num}</div>)}
          </li>
          {section===0 &&
          <FormSection section={section} setSection={setSection}>
            <li>
              <label>
                <span className='mid'>Select A Service</span>
                <SelectOptions setMoving={setMoving} setJunk={setJunk} setMisc={setMisc} setSection={setSection} section={section} junk={junk} setMedQty={setMedQty} setLgQty={setLgQty} medQty={medQty} lgQty={lgQty} setService={setService}/>
              </label>
            </li>
          </FormSection>}
          {section===1 &&
         <FormSection section={section} setSection={setSection} service={service} address={address} destination={destination} date={date} time={time}>
            <fieldset>
              <legend>Where To?</legend>
                <li>
                  <label>
                    address
                    <Address setAddress={setAddress} address={address} service={service} setCity={setCity}/>
                  </label>
                </li>
              {moving && <li>
                <label>
                  destination
                  <Address setAddress={setDestination} address={destination} setDistance={setDistance} origin={address}/>
                </label>
              </li>}
            </fieldset>
            <fieldset>
            <legend>When?</legend>
              <li>
                <label>
                  choose a date
                  <DateInput date={date} setDate={setDate}/>
                </label>
              </li>
              <li>
                <label>
                  select arrival time
                  <select value={time} onChange={(e)=>setTime(e.target.value)}>
                    <option disabled value={''}>Select</option>
                    {timeOptions.map((option)=>(
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </li>
            </fieldset>
          </FormSection>}
          {/* backend call to see which dates/times are available */}
          {section===2 &&
          <FormSection section={section} setSection={setSection} service={service}>
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
            {err1 && <Message msg={'Please fill out all fields'} type={'success'}/>}
            <button type='submit' onClick={handleSubmit}>submit</button><br/>
          </FormSection>}
        </ol>
      </form>
      {!msgForm 
      ? <GotAQuestion showMsgForm={showMsgForm}/>
      : <MsgForm showMsgForm={showMsgForm} setSuccess={setSuccess}/>}
      {success && <Message msg={'Thank you for your message!'} type={'success'}/>}
    </div>
  )
}
const SelectOptions=({setMoving, setJunk, setMisc, setSection, section, junk, medQty, lgQty, setMedQty, setLgQty, setService})=>{
  const [next, setNext] = useState(true);
  const [err1, setErr1] = useState(false);
  const handleMoving=(e)=>{
    e.preventDefault();
    setMoving(true);
    setJunk(false);
    setMisc(false);
    setSection(section+1);
    setService('Moving Services')
  }
  const handleJunk=(e)=>{
    e.preventDefault();
    setJunk(true);
    setMoving(false);
    setMisc(false);
    !(medQty<1 && lgQty<1) ? setSection(section+1)
    : setErr1(true);
    setService('Junk Removal')
  }
  const handleMisc=(e)=>{
    e.preventDefault();
    setMisc(true);
    setJunk(false);
    setMoving(false);
    setSection(section+1);
    setService('Assembly/Other')
  }
  const addMed=(e)=>{
    e.preventDefault();
    setMedQty(medQty+1);
  }
  const subMed=(e)=>{
    e.preventDefault();
    medQty>0 && setMedQty(medQty-1);
  }
  const addLg=(e)=>{
    e.preventDefault();
    setLgQty(lgQty+1);
  }
  const subLg=(e)=>{
    e.preventDefault();
    lgQty>0 && setLgQty(lgQty-1);
  }
  return(
    <div>
      <ol className='select'>
      <li onClick={handleMoving}>
          <img src={truck}/>
          <div>moving service</div>
          <div>$100 + $3.25/mile + $100/hr</div>
        </li>
        <li>
          <img src={junkIcon}/>
          <div>junk removal</div>
          {junk && <div>
            <div>medium item (50-100 lbs or largest side less than 48"): $100 
              <button onClick={addMed}>+</button> 
              <button onClick={subMed}>-</button>
              ({medQty})
              </div>
            <div>large item (100-150 lbs or largest side less than 96"): $200 
              <button onClick={addLg}>+</button>
              <button onClick={subLg}>-</button>
              ({lgQty})
              </div>
          </div>}
          {err1 && <Message msg={'please enter desired quantity'} type={'success'}/>}
          <button onClick={handleJunk}>select items</button>
        </li>
        <li onClick={handleMisc}>
          <img src={assembly}/>
          <div>Assembly/Misc</div>
          <div>$50 + $150/hr</div>
        </li>
      </ol>
      <div className='pricing'>
      </div>
    </div>
  )
}
const FormSection=({children, setSection, section, service, address, destination, date, time, name, phone, email})=>{
  const [err1, setErr1] = useState(false)
  useEffect(()=>{
    setTimeout(() => {
      setErr1(false)
    }, 2000);
  }, [err1])
  const inputs=[address, date, time]
  const handleNext=(e)=>{
    e.preventDefault();
    if (address==='' || date==='' || time===''){
      setErr1(true);
      return;
    } else if((service==='Moving Services') && destination===''){
      setErr1(true);
      return;
    }
    setSection(section+1);
  }
  return(
    <div className='formSection'>
      {children}
      {err1 && <Message msg={'please fill out all fields'} type={'warning'}/>}
      {(section<2 && section>0) 
      && <button onClick={handleNext}>next</button>}
      <p>{service && `service: ${service}`}</p>
    </div>
  )
}
const Address=({address, setAddress, setDistance, origin, setCity})=>{
  const handleSelect=async(addy, i, obj)=>{
    setAddress(addy);
    setCity && setCity(obj.terms[2].value);
    // if this is the destination input
    if (setDistance){
      const re = await services.calcDistance(origin, addy);
      setDistance(re.data.rows[0].elements[0].distance.text);
    }
  }
  return(
    <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className='addressContainer'>
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
          <Route path='/sched' element={<AdminPage/>} />
          <Route path='/pricing' element={<PricingPage/>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
