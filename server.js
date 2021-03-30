// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
// Start up an instance of app
const express = require('express');
const app = express();

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// API Key
const apiKey = 'b9c3560888951e57746b531dd9501b40';

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 8080;
const server = app.listen(port,()=>{
    console.log('Listening on port 8080');
});

app.get('/all',(req,res)=>{
    res.send(JSON.stringify(projectData));
});

app.post('/addjournal',(req,res)=>{
    const data = req.body;
    try{
        // The wording of the project wasn't clear, i wasn't sure if
        // I should replace the previous entry or preserve it.
        // I also didn't know how which property name should I 
        // use if I was supposed to preserve previous entries so 
        // I just replaced the previous entry.
        projectData = {
            temprature:data.temprature,
            date:data.date,
            response:data.response,
        };
        console.log('DATA RECEIVED!');
        console.log(projectData);
        res.send(JSON.stringify({
            status:'success'
        }));
    }
    catch(err){
        res.send(JSON.stringify({
            status:'error'
        }));
        throw err;
    }
});
