const {app, BrowserWindow} = require('electron')
const url = require("url");
const path = require("path");
const {exec, spawn} = require('child_process')
let mainWindow

function createWindow () {
  //TODO: Load API Locally




  // api.stdout.on('data', data => console.error(data))
  //
  // api.stderr.on('data', data => console.error(data))
  // api.on('error', err => {console.error(err)})

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
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
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
