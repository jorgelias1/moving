import { useState, useEffect } from 'react'
import {SignUpForm, LoginForm} from './sign-up'
import { getCurrentUser, signUp, signIn, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword } from '@aws-amplify/auth'

export const AdminPage=()=>{
    const [signIn, showSignIn] = useState(false);
    const [questions, setQuestions] = useState([]);
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
        services.getQuestions().then(re=>{
        re.data.rows && setQuestions(re.data.rows);
        })
    }, [])
    return(
        <>
        {signIn 
        ? <LoginForm/>
        : <div className='all'>
            <ScheduleTable/>
            <PastAppts/>
            <QuestionTable questions={questions} />
            </div>}
        </>
    )
}
const QuestionTable=({questions})=>{
    return(
        <div className='scrollTable'>
        <table>
            <thead>
            <tr>
                <th>question</th>
                <th>phone number</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {questions.map((question, i)=>{
                <tr key={i}>
                <td>{question.question}</td>
                <td>{question.number}</td>
                <td onClick={()=>services.removeQuestion(question)}><button>remove</button></td>
                </tr>
            })}
            </tbody>
        </table>
        </div>
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