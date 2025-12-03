//Julia Lemos
const { app, BrowserWindow } = require('electron'); 
const path = require('path'); 

function createWindow () { 
  const win = new BrowserWindow({ 
    width: 800, 
    height: 600, 
    webPreferences: { 
      // Não é necessário se você não for usar o 'preload.js'
      // preload: path.join(__dirname, 'preload.js'), 
      nodeIntegration: true, 
      contextIsolation: false 
    } 
  }); 
  win.loadFile('index.html'); 
  // win.webContents.openDevTools(); // Opcional: para debug 
} 

app.whenReady().then(createWindow); 

app.on('window-all-closed', () => { 
  if (process.platform !== 'darwin') { 
    app.quit(); 
  } 
}); 
