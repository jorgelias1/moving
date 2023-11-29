const axios = require('axios')
require('dotenv').config()

const getPlacesUrl=()=>{
    return axios.get(`https://maps.googleapis.com/maps/api/js?key=${process.env.apiKey}&libraries=places&callback=Function.prototype`)
}
const calcDistance=(A, B)=>{
    return axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations='${B}'&origins='${A}'&units=imperial&key=${process.env.apiKey}`)
}
module.exports={
    getPlacesUrl,
    calcDistance,
}