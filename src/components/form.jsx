import { useState, useEffect, useRef } from 'react'
import {Arrow} from './svg'
import services from '../functions/frontRequests'
import truck from '../../../../Desktop/untitled2-c.png'
import junkIcon from '../../../../Desktop/junk1-c.png'
import assembly from '../../../../Desktop/tools-c.png'
import PlacesAutocomplete from 'react-places-autocomplete'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export const PricingPage=()=>{
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
      try{
        await services.postMessage(`new appointment for ${date} at ${address}: ${service} service`);
        await services.addPastAppt(city, service, total);
        await services.addToSchedule({address, service, date, name, phone, email, time, destination});
      } catch(err){
        console.log(err)
      }
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
      <div className='flexH'>
          <div className='estimate'>
            <span className="material-symbols-outlined">
              verified_user
            </span>
            <p>Simply Secure</p>
          </div>
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
                    <fieldset>
                      <legend className='mid'>Select A Service</legend>
                      <SelectOptions setMoving={setMoving} setJunk={setJunk} setMisc={setMisc} setSection={setSection} section={section} junk={junk} setMedQty={setMedQty} setLgQty={setLgQty} medQty={medQty} lgQty={lgQty} setService={setService}/>
                    </fieldset>
                </li>
              </FormSection>}
              {section===1 &&
             <FormSection section={section} setSection={setSection} service={service} address={address} destination={destination} date={date} time={time}>
                <fieldset>
                  <legend>Where To?</legend>
                    <li>
                      <label>
                        address*
                        <Address setAddress={setAddress} address={address} service={service} setCity={setCity}/>
                      </label>
                    </li>
                  {moving && <li>
                    <label>
                      destination*
                      <Address setAddress={setDestination} address={destination} setDistance={setDistance} origin={address}/>
                    </label>
                  </li>}
                </fieldset>
                <fieldset>
                <legend>When?</legend>
                  <li>
                    <label>
                      choose a date*
                      <DateInput date={date} setDate={setDate}/>
                    </label>
                  </li>
                  <li>
                    <label>
                      select arrival time*
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
              {section===2 &&
              <FormSection section={section} setSection={setSection} service={service}>
                <li>
                  <fieldset>
                    <legend>contact info</legend>
                    <label>Name* <input type='text' autoComplete='off' value={name} onChange={(e)=>setName(e.target.value)} required/></label>
                    <br/>
                    <label>Phone Number* <input type='tel' value={phone} onChange={(e)=>setPhone(e.target.value)}required/></label>
                    <br/>
                    <label>Email* <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)}required/></label>
                  </fieldset>
                </li>
                {/* <li>confirm details + payment</li> */}
                {err1 && <Message msg={'Please fill out all fields'} type={'success'}/>}
                <button type='submit' onClick={handleSubmit}>submit</button><br/>
              </FormSection>}
            </ol>
          </form>
          {success && <Message msg={'Thank you for your message!'} type={'success'}/>}
      </div>
    )
  }
  const SelectCard=({children, img, pricing})=>{
    return(
      <div className='selectCard'>
        <div>
          <div className='selectTitle'>
            {children}
          </div>
          <div>Order Now</div>
          <div className='price'>{pricing}</div>
        </div>
        <img src={img}/>
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
            <SelectCard img={truck} pricing={'$100 + $3.25/mile + $100/hr'}>
              <div className='flexH'>
                <div style={{fontSize:'1.8rem', transform:'translateY(-0.13rem)'}}>m</div>oving
              </div>
              <div className='flexH'>service</div>
            </SelectCard>
          </li>
          <li onClick={handleJunk}>
            <SelectCard img={junkIcon} pricing={junk && <JunkPricing addMed={addMed} subMed={subMed} addLg={addLg} subLg={subLg} medQty={medQty} lgQty={lgQty} setSection={setSection} section={section}/>}>
              <div>
                <div>junk removal</div>
              </div>
            </SelectCard>
          </li>
          <li onClick={handleMisc}>
            <SelectCard img={assembly} pricing={'$50 + $150/hr'}>
              <div>
                <div>Assembly/ Misc</div>
              </div>
            </SelectCard>
          </li>
        </ol>
        <div className='pricing'>
        </div>
      </div>
    )
  }
  const JunkPricing=({addMed, subMed, addLg, subLg, medQty, lgQty, setSection, section})=>{
    const handleSubmit=(e)=>{
      e.preventDefault();
      !(medQty<1 && lgQty<1) && setSection(section+1);
    }
    return(
      <div>
        {<div className='success'>Please Select Qty of Items</div>}
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
        <button className='submit' onClick={handleSubmit}>submit</button>
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
  const DateInput = ({date, setDate}) => {
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