const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'StudyMate AI - Autonomous Learning Manager',
    backgroundColor: '#090d16',
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Remove default menu bar for clean AI Lab aesthetic
  Menu.setApplicationMenu(null);

  // Load Next.js web app (or local fallback index)
  const appUrl = process.env.STUDYMATE_URL || 'http://localhost:3000';
  mainWindow.loadURL(appUrl).catch(() => {
    // If Next.js dev server is starting, retry loading after a short delay
    setTimeout(() => mainWindow.loadURL(appUrl), 2000);
  });

  // Open external links in default Windows browser (security sandbox)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
