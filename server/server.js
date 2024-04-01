const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const cors = require('cors');
const { addData, getISTDateTime, sendDates, sendData, currentData } = require('./controllers/dbController');

const wss = new WebSocket.Server({ server:server });

require('dotenv').config();



app.use(cors());
app.use(logger);
app.use(express.static('./public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(logError);

const decoder = new TextDecoder();


app.get('/dates', sendDates);
app.get('/dates/:date', sendData);
app.get('*', (req, res) => res.status(200).send("only API"));

wss.on('connection', (ws) => {
    console.log('new client: '+ ws);
    ws.send('Welcome New Client!');

  
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      let text = decoder.decode(message);
      if(text.match('update')) {

        let data = JSON.parse(text);
        
        data.timestamp = getISTDateTime().split(',')[1];
        data.inw = parseFloat(data.inv) * parseFloat(data.ina);
        data.outw = parseFloat(data.outv) * parseFloat(data.outa);
        
        delete data.event;
        
        addData(data);
        
        data.event = 'update';
        
        text = JSON.stringify(data);
      }
  
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(text);
        }
      });
    });
  });


function logError(error, req, res, next) {

    if (error) {
        console.log("error");
        res.status(400).send('error');
    } else {
      next();
    }
}


function logger(req, res, next) {
    const ipAddr = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    console.log(ipAddr + ' ' + req.method + ''+ req.url);
    next();
}

// listener

const port = process.env.PORT || 80;

server.listen(port, () => {
    console.log('Listening on port '+ port +'..');
});