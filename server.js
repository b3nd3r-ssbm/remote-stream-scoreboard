const https = require('https');
const fs = require('fs');

let data = {};
let code;

function newSession() {
  data = {purpose:"newSession"};
  return checkFunc(data);
}

function update(code) {
  data = {'purpose':'check','code':code};
  checkFunc(data).then((data) => {
    updateFiles(JSON.parse(data));
  });
}

function closeSession(code) {
  data = {'purpose':'closeSession','code':code};
  return checkFunc(data);
}

const options = {
  hostname: 'scoreboardServer.b3nd3rssbm.repl.co',
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

function checkFunc(jsonData) {
  let check = new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data='';
      res.on('data', d => {
      data+=d;
      });
      
      res.on('end', () => {
      resolve(data);
      });
    });
  
    req.on('error', error => {
      console.error(error)
    });
  
    req.write(JSON.stringify(jsonData));
    req.end();
  });
  return check;
}

function updateFiles(data) {
  fs.writeFileSync('./ScoreFiles/p1.txt',data.p1.tag,'utf8');
  fs.writeFileSync('./ScoreFiles/p2.txt',data.p2.tag,'utf8');
  fs.copyFileSync('./char-icons/'+data["p1"].character+'/'+data['p1'].costume+'.png','./ScoreFiles/p1Char.png');
  fs.copyFileSync('./char-icons/'+data["p2"].character+'/'+data['p2'].costume+'.png','./ScoreFiles/p2Char.png');
  fs.writeFileSync('./ScoreFiles/p1score.txt',data.p1.score,'utf8');
  fs.writeFileSync('./ScoreFiles/p2score.txt',data.p2.score,'utf8');
}

module.exports = { newSession, update, closeSession }