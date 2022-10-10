const { app, BrowserWindow, Menu, globalShortcut } = require('electron');

const path = require('path');
const { initHandler } = require('./src/handler');
const width = 300
const height = 600
const createWindow = () => {
  const win = new BrowserWindow({
    width: width,
    height: height,
    icon: "./paimeng.ico",
    maxWidth: width,
    maxHeight: height,
    fullscreen: false,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
  });
  win.loadFile('index.html');
};
// 取消头部菜单栏
Menu.setApplicationMenu(null)
app.whenReady().then(() => {
  globalShortcut.register('Alt+CommandOrControl+V', () => {
    const windows = BrowserWindow.getAllWindows()
    windows[0].show();
  })
  initHandler()
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    globalShortcut.unregisterAll()
    app.quit();
  }
});
