const {app, BrowserWindow} = require('electron')
require('electron-reload')(__dirname)
const url = require('url')
const path = require('path')


let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

app.on('ready', createWindow)
