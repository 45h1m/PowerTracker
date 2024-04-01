const readDB = require('./readDB')
const writeDB = require('./writeDB')
const readDir = require('./readDir')
const fs = require('fs')

let currentData = [];
let timer = 100;

async function initCurrentData() {

    const fileName = getISTDateTime().split(',')[0];

    try {

        const readStatus = await readDB('./db/'+ fileName + '.json');

        const data = await readDB('./db/'+ fileName+'.json');

        currentData = data;

    } catch (error) {

        console.log(error);
        writeDB([], './db/'+fileName +'.json');
    }
}

initCurrentData();

function addData(jsonData) {

    
    if(timer++ >= 100) {
        timer = 0;
        
        currentData.push(jsonData);
        saveCurrentData(getISTDateTime().split(',')[0]);
    }
}

async function saveCurrentData(fileName) {

    const writeStatus = await writeDB(currentData, './db/'+fileName+'.json');
    console.log(writeStatus);
}

async function sendDates(req, res) {

    try {
        
        const readStatus = await readDir('./db/');
        console.log(readStatus);
        res.status(200).json(readStatus);

    } catch (error) {
     
        console.log(error)
        res.status(400).json({
            error: "Something went wrong"
        });
    }
}

async function sendData(req, res) {

    const date = req.params.date;

    if(!fs.existsSync(`./db/${date}`)) {
        return res.status(404).json({
            error: "No data exists: "+date
        })
    }

    const data = await readDB(`./db/${date}`);

    res.status(200).json(data);

    console.log(date + ' sent');
}

async function sendRealtimeData(req, res) {

    res.status(200).json(currentData);
} 

function getISTDateTime() {
    const options = { timeZone: 'Asia/Kolkata' };
    const istDateTime = new Date().toLocaleString('en-US', options).replaceAll('/', '-');
    return istDateTime;
};

module.exports = {initCurrentData, addData, getISTDateTime, sendDates, sendData, currentData}