const {app, BrowserWindow} = require('electron');
const path = require('path');

const createWindow = () => {
    const window = new BrowserWindow({
        width: 450,
        height: 500,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false
        }
    })
    window.loadFile("index.html")
}

app.whenReady().then(()=>{
    createWindow();
})

app.on('window-all-closed', () => {
    if(process.platform != 'darwin') app.quit
})