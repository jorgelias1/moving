const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const service = require('./services/axiosRequests.js')
const AWS = require('aws-sdk');
const db = require('./db.js')
const awsServerlessExpress = require('aws-serverless-express')

AWS.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: 'us-west-1',
});
app.use(cors({origin:'https://envir.d393044i9spbrh.amplifyapp.com'}))
app.use(express.json())

app.get('/api/places', async(request, response)=>{
    const re = await service.getPlacesUrl();
    response.send(re.data)
})
app.post('/api/distance', async(request, response)=>{
    const obj = request.body;
    const re = await service.calcDistance(obj.A, obj.B);
    response.send(re.data)
})
app.post('/api/posted', async(request, response)=>{
    const sns = new AWS.SNS();
    const {content} = request.body;
    const params = {
      Message: content,
      TopicArn: 'arn:aws:sns:us-west-1:086519842133:Moving',
    };
    
    sns.publish(params, (err, data) => {
      if (err) {
        console.error('Error publishing message to SNS:', err);
      } else {
        console.log('Message published successfully:', data.MessageId);
        response.send('success')    
      }
    });
})
app.get('/api/schedule', async(request, response)=>{
    try{ 
        const re = await db.getSchedule();
        response.send(re);
    } catch(err){
        console.log(err)
    }
})
app.post('/api/schedule', async(request, response)=>{
    const appt=request.body;
    try{
        await db.addToSchedule(appt.appt);
        response.send('success!')
    } catch(err){
        console.log(err)
    }
})
app.delete('/api/schedule', async(request, response)=>{
    try{
        await db.cleanSchedule();
        response.send('success!')
    } catch(err){
        console.log(err)
    }
})
app.get('/api/dates', async(request, response)=>{
    try{
        const re = await db.getDates();
        response.send(re.rows)
    } catch(err){
        console.log(err)
    }
})
app.post('/api/question', async(request, response)=>{
    try{
        const obj=request.body;
        await db.postQuestion(obj.number, obj.question);
        response.send('success!')
    } catch(err){
        console.log(err);
    }
})
app.post('/api/appt', async(request, response)=>{
    try{
        const obj=request.body;
        await db.postAppt(obj.location, obj.service, obj.pay);
        response.send('success')
    } catch(err){
        console.log(err)
    }
})
app.get('/api/appt', async(request, response)=>{
    try{
        const re = await db.getAppt();
        response.send(re.data)
    } catch(err){
        console.log(err);
    }
})
app.get('/api/questions', async(request, response)=>{
    try{
        const re = await db.getQuestions();
        response.send(re.data)
    } catch(err){
        console.log(err)
    }
})
app.post('/api/questions', async(request, response)=>{
    try{
        await db.removeQuestion(question);
        response.send('success')
    } catch(err){
        console.log(err)
    }
})
const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
}
// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)