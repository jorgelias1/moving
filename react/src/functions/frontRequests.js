import axios from 'axios'
const baseUrl = 'http://localhost:3001'

const calcDistance=(A, B)=>{
    return axios.post(`${baseUrl}/api/distance`, {A, B})
}
const postMessage=()=>{
    return axios.get(`${baseUrl}/api/posted`)
}
const addToSchedule=(appt)=>{
    return axios.post(`${baseUrl}/api/schedule`, {appt})
}
const getSchedule=()=>{
    return axios.get(`${baseUrl}/api/schedule`)
}
const getDates=()=>{
    return axios.get(`${baseUrl}/api/dates`)
}
const cleanSchedule=()=>{
    return axios.delete(`${baseUrl}/api/schedule`)
}
export default{
    calcDistance,
    postMessage,
    addToSchedule,
    getSchedule,
    cleanSchedule,
    getDates,
}