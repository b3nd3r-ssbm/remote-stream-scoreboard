const {app, BrowserWindow, remote} = require('electron');
const {newSession,update,closeSession} = require('./server.js');

let code;
let time = 0;
let start = false;

if (app !== undefined) {
    app.on('ready', function () {
		let win = new BrowserWindow({
            frame: false,
			webPreferences: {
                nodeIntegration: true
            }
        });
        win.loadURL(`file://${__dirname}/index.html`);
    });
}

function init() {
  newSession().then((data) => {
    setCode(JSON.parse(data).code);
	setStart();
  });
}

function setup() {
  loop();
}

function draw() {
  if(millis()-time >= 30000 && start == true){
    update(code);
	time=millis();
  }
}

function setStart() {
  start = true;
}

function setCode(data) {
  code = data;
  document.getElementById("code").innerHTML = data;
}