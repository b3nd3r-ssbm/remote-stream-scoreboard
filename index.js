const {shell, app, BrowserWindow, remote, Notification} = require('electron');
const {newSession,update,closeSession} = require('./server.js');
const {check, getLatest} = require('./check-for-updates.js');

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
  
  getLatest().then((data) => {
    console.log(data);
    if(isTagGreater(data, "v"+remote.app.getVersion())) {
      check().then((data) => {
         document.getElementById("updater").hidden = false;
	     document.getElementById("updater").setAttribute("onclick","shell.openExternal('"+data.url+"')");
      });
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

function tagInt(tagName) {
  let majorStr = tagName.substring(tagName.indexOf("v")+1,tagName.indexOf("."));
  major = parseInt(majorStr);
  tagName = tagName.substring(tagName.indexOf("v"+majorStr)+majorStr.length+2);
  let minorStr=tagName.substring(0,tagName.indexOf("."));
  let minor = parseInt(minorStr);
  tagName = tagName.substring(tagName.indexOf("."));
  let patchStr = tagName.substring(1);
  let patch = parseInt(patchStr);
  return [major,minor,patch];
}

function isTagGreater(tag1, tag2){
  tag1 = tagInt(tag1);
  tag2 = tagInt(tag2);
  if(tag1[0] > tag2[0]) {
    return true;
  }
  if(tag1[0] == tag2[0]) {
    if(tag1[1] > tag2[1]){
      return true;
    }
    if(tag1[1] == tag2[1]) {
      if(tag1[2] > tag2[2]) {
        return true;
      }
    }
  }
  return false;
}