const { app, BrowserWindow, Menu, session, screen } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');

let mainWindow;

function createWindow() {
  const display = screen.getPrimaryDisplay()
  const maxiSize = display.workAreaSize
  mainWindow = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    width: 1066,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'icon/32x32.ico')
  });
   /*const emptyMenu = Menu.buildFromTemplate([]);
   mainWindow.setMenu(emptyMenu);*/

  const mainSession = mainWindow.webContents.session;
  mainSession.webRequest.onBeforeSendHeaders({ urls: ['*://*/*'] }, (details, callback) => {
    details.requestHeaders['Referer'] = 'https://';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  mainSession.webRequest.onBeforeSendHeaders({ urls: ['https://www.youtube.com/tv'] }, (details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64; Xbox; Xbox One; Valve Steam Gamepad) TV (PLATFORM_DETAIL_ATV) NVIDIA Coorporation/NVIDIATEGRA AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.4430.91 Safari/537.36 Cobalt/40.13031-gold Starboard/1 V2.1/gxl';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../web/home.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
