const {app, BrowserWindow, remote, shell} = require('electron');
const {newSession,update,closeSession} = require('./server.js');
const {check} = require('check-for-updates');

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
  check().then((data) => {
    if(data.isNew){
      document.getElementById("updater").hidden = false;
	  document.getElementById("updater").setAttribute("onclick","shell.openExternal('"+data.url+"')");
    }		
  });
}

function setup() {
  loop();
}

function draw() {
  if(millis()-time >= 30000 && start){
    update(code).then((data) => {
      document.getElementById("jsonHere").innerHTML=JSON.stringify(data);
	});
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