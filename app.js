const {app, BrowserWindow, electron} = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs');
const {exec, spawn} = require('child_process')
const StreamZip = require('node-stream-zip');
const axios = require('axios')
let mainWindow


let githubUsername = 'llamanade1127';
let githubRepo = 'Valders-API';
let token = "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";
async function UpdateAPI(res) {
  let fileResponse = await axios({
    url: res['assets'][0].url,
    method: "GET",
    headers: {
      "accept": "application/octet-stream",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
      //@ts-ignore
      "Authorization": `Bearer ${token}`
    },
    responseType: 'stream'
  })

  //Open stream and write to it
  const writer = fs.createWriteStream(`./${res.assets[0].name}`)
  fileResponse.data.pipe(writer)

  await new Promise((resolve, reject) => {

    writer.on('finish', resolve)
    writer.on('error', reject)
  })

  writer.close();

  console.log('File downloaded. Extracting...')
  if(!fs.existsSync('./extracted'))fs.mkdirSync('extracted')
  const zip = new StreamZip.async({ file: `./${res.assets[0].name}` });

  const count = await zip.extract(null, './');
  console.log(`Extracted ${count} entries`);
  await zip.close();

  if(fs.existsSync(`./${res.assets[0].name}.zip`)) fs.rmdirSync(`./${res.assets[0].name}.zip` );
  fs.rmdirSync('./extracted')
  console.log("New Version Installed")

}


async function CheckAPI() {

  let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    //@ts-ignore
    "Authorization": `Bearer ${token}`
  }

  let newReleaseRequest = {
    "Method": "GET",
    "url": `https://api.github.com/repos/${githubUsername}/${githubRepo}/releases/latest`,
    "Headers": headers
  }


  try {
    var res = await axios.get(`https://api.github.com/repos/${githubUsername}/${githubRepo}/releases/latest`, {headers: headers});
  } catch(e) {
    console.log(e)
  }




  if(!fs.existsSync("./API")) fs.mkdirSync("./API")

  if(!fs.existsSync("./API/package.json")) {
    //Download the needed files
    await UpdateAPI(res.data);
  } else {


    let meta = (JSON.parse(fs.readFileSync(`./API/package.json`).toString())).version.split('.');
    let version = res.data['tag_name'].slice(1).split('.')
    console.log(meta);
    console.log(version);
    for(let i = 0; i < version.length; i++) {
      if(+version[i] > +meta[i]) {
        console.log("Updating")
        await UpdateAPI(res.data);
        break;
      }
    }




  }
}
async function createWindow () {
  require('update-electron-app')()
  if(require('electron-squirrel-startup')) app.quit();

  //TODO: Check API and load it if found, if not download then run it
  let isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() === 'true') : false;
  if(!isDev)
    await CheckAPI();




  api = exec(`cd API & start ${path.join(__dirname, '/API/api.exe')}`, {shell: false, windowsHide: true})


  api.stdout.on('data', data => console.error(data))

  api.stderr.on('data', data => console.error(data))
  api.on('error', err => {console.error(err)})

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/chromebook-data/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    //api.kill()
    mainWindow = null
  })


  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.on('ready', () => {
  createWindow();
})

app.on('window-all-closed', function () {
  //api.kill()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
