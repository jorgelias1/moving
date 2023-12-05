import axios from 'axios'
const baseUrl = 'http://localhost:3001'

const calcDistance=(A, B)=>{
    return axios.post(`${baseUrl}/api/distance`, {A, B})
}
const postMessage=(content)=>{
    return axios.post(`${baseUrl}/api/posted`, {content})
}
const postQuestion=(number, question)=>{
    return axios.post(`${baseUrl}/api/question`, {number, question})
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
const addPastAppt=(location, service, pay)=>{
    return axios.post(`${baseUrl}/api/appt`, {location, service, pay})
}
const getPastAppts=()=>{
    return axios.get(`${baseUrl}/api/appt`)
}
const getQuestions=()=>{
    return axios.get(`${baseUrl}/api/questions`)
}
const removeQuestion=(question)=>{
    return axios.post(`${baseUrl}/api/questions`, {question})
}
export default{
    calcDistance,
    postMessage,
    addToSchedule,
    getSchedule,
    cleanSchedule,
    getDates,
    postQuestion,
    addPastAppt,
    getPastAppts,
    getQuestions,
    removeQuestion,
}