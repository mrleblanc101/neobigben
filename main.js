const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const loadURL = serve({ directory: '.output/public/' });

const createWindow = async () => {
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const win = new BrowserWindow({
        minWidth: 375,
        minHeight: 600,
        width,
        height,
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInWorker: true,
            sandbox: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    // win.webContents.openDevTools();
    await loadURL(win);

    ipcMain.handle('color-mode:switch', (e, value) => {
        nativeTheme.themeSource = value;
    });

    win.webContents.executeJavaScript('localStorage.getItem("nuxt-color-mode");', true).then((theme) => {
        nativeTheme.themeSource = theme;
        if (
            (nativeTheme.themeSource === 'system' && nativeTheme.shouldUseDarkColors) ||
            nativeTheme.themeSource === 'dark'
        ) {
            win.setBackgroundColor('#111827');
        } else {
            win.setBackgroundColor('#ffffff');
        }
    });

    win.webContents.on('did-finish-load', () => {
        win.show();
    });
};

app.whenReady().then(async () => {
    await createWindow();

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
