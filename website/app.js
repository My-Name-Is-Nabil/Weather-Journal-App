// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'/'+ d.getDate()+'/'+ d.getFullYear();
const button = document.getElementById('generate');
const apiKey = 'b9c3560888951e57746b531dd9501b40';
const message = document.querySelector('.message');
const getWeather = async zip => {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=metric`;     
    const response = await fetch(url);
    if (response.status===404){
        message.innerHTML = 'Error 404!';
        message.classList.add('error');
        throw new Error('404 not found');
    }
    else if (!response.ok){
        message.innerHTML = 'Error while fetching data! Please try again later.'
        message.classList.add('error');
        throw new Error('Error while fetching data');
    }    
    const data = await response.json();
    if (data.cod!==200)
    {
        message.innerHTML = 'Wrong ZIP code!'
        message.classList.add('error');
        throw new Error('Wrong ZIP code');
    }
    return {
        date:newDate,
        temprature:Number((data['main']['temp']).toFixed(1)),
    };
}; 

const postData = async (url,data) => {
    const userResponse = document.getElementById('feelings').value;
    data.response = userResponse;
    const response = await fetch(url,{
        method:'post',
        mode:'cors',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(data),
    });
    if(response.ok){
        message.innerHTML = 'Successfully recorded your Journal.'
        message.classList.remove('error');
        console.log('Successfully sent data.');
    }
    else {
        message.innerHTML = 'Error while sending data! Please try again later.'
        message.classList.add('error');
        console.error('Error in sending data.');
    }
    return response;
};

const updateUI = async () => {
    const date = document.getElementById('date');
    const temp = document.getElementById('temp');
    const content = document.getElementById('content');
    const [lastDate,lastTemp,lastContent] = document.querySelectorAll('.entry__data');
    const response = await fetch('/all');
    if (!response.ok)
        throw new Error('Error');
    const data = await response.json();
    if (!data.date){
        const lastEntry = document.getElementById('entryHolder');
        lastEntry.classList.add('hide-entryHolder');
        const noEntries = document.createElement('p');
        noEntries.classList.add('no-entries');
        noEntries.innerHTML = 'No entries yet!';
        const entry = document.querySelector('.holder.entry');
        entry.appendChild(noEntries);
    }
    else{
        const lastEntry = document.getElementById('entryHolder');
        lastEntry.classList.remove('hide-entryHolder');
        const noEntries = document.querySelector('.no-entries');
        if (noEntries)
            noEntries.remove();
        lastDate.innerHTML = data.date;
        lastTemp.innerHTML = data.temprature+'°C';
        lastContent.innerHTML = data.response;
    }
};  

const activateButton = () => {
    const zip = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;
    if (zip.length >= 5){
        button.disabled = false;
    }
    else
        button.disabled = true;
};

document.addEventListener('DOMContentLoaded',async () => {
    updateUI()
    .then(activateButton);

});

button.addEventListener('click',async() => {
    const zip = document.getElementById('zip').value;
    getWeather(zip)
    .then(data => postData('addJournal',data))
    .catch(err => {
        console.error(err.message)
    })
    .then(updateUI)
    .catch(err => {
        console.error(err.message);
    });
});

//From stack overflow 
const preventNonNumbers = event => {
    const characterCode = event.keyCode;
    const character = String.fromCharCode(characterCode);
    if (!character.match(/^[0-9]+$/))
        event.preventDefault();
};

document.getElementById('zip').addEventListener('input',activateButton);
