const { app, BrowserWindow, Menu, ipcMain } = require('electron');
if (require('electron-squirrel-startup')) {
  app.quit();
}
const path = require('path');
const { DatabaseService } = require('./database/database.service');

let mainWindow;
let databaseService;

function createWindow() {
  Menu.setApplicationMenu(null);
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    icon: path.join(__dirname, 'public/images/logo-icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile(path.join(__dirname, 'dist/sweet-juliet/browser/index.html'));
}

app.whenReady().then(async () => {
  databaseService = new DatabaseService();
  await new Promise(resolve => setTimeout(resolve, 100));
  setupIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    databaseService.close();
    app.quit();
  }
});

function setupIpcHandlers() {
  ipcMain.handle('createUser', async (event, user) => {
    return databaseService.createUser(user);
  });

  ipcMain.handle('getUserById', async (event, user_id) => {
    return databaseService.getUserById(user_id);
  });

  ipcMain.handle('getUserByUsername', async (event, username) => {
    return databaseService.getUserByUsername(username);
  });

  ipcMain.handle('createChild', async (event, child) => {
    return databaseService.createChild(child);
  });

  ipcMain.handle('getChildrenByUserId', async (event, user_id) => {
    return databaseService.getChildrenByUserId(user_id);
  });

  ipcMain.handle('createEvent', async (event, eventObj) => {
    return databaseService.createEvent(eventObj);
  });

  ipcMain.handle('getEvent', async (event, event_id) => {
    const result = databaseService.getEvent(event_id);
    return result;
  });

  ipcMain.handle('getEventsByChildId', async (event, child_id) => {
    return databaseService.getEventsByChildId(child_id);
  });

  ipcMain.handle('createMetric', async (event, metric) => {
    return databaseService.createMetric(metric);
  });

  ipcMain.handle('getMetric', async (event, metric_id) => {
    const result = databaseService.getMetric(metric_id);
    return result;
  });

  ipcMain.handle('getMetricsByChildId', async (event, child_id) => {
    return databaseService.getMetricsByChildId(child_id);
  });

  ipcMain.handle('createNote', async (event, note) => {
    return databaseService.createNote(note.note_record, note.metric_id, note.event_id);
  });

  ipcMain.handle('getNotesByMetricId', async (event, metric_id) => {
    return databaseService.getNotesByMetricId(metric_id);
  });

  ipcMain.handle('getNotesByEventId', async (event, event_id) => {
    return databaseService.getNotesByEventId(event_id);
  });

  ipcMain.handle('getNotesByDayAndChild', async (event, child_id, date) => {
    return databaseService.getNotesByDayAndChild(child_id, new Date(date));
  });

  ipcMain.handle('getFeedingCountByDayAndChild', async (event, child_id, date) => {
    return databaseService.getFeedingCountByDayAndChild(child_id, date);
  });

  ipcMain.handle('getSleepCountByDayAndChild', async (event, child_id, date) => {
    return databaseService.getSleepCountByDayAndChild(child_id, date);
  });

  ipcMain.handle('getLastWeightByChildBeforeDate', async (event, child_id, date) => {
    return databaseService.getLastWeightByChildBeforeDate(child_id, new Date(date));
  });

  ipcMain.handle('getLastHeightByChildBeforeDate', async (event, child_id, date) => {
    return databaseService.getLastHeightByChildBeforeDate(child_id, new Date(date));
  });

  ipcMain.handle('getUpcomingEventsByDayAndChild', async (event, child_id, date) => {
    return databaseService.getUpcomingEventsByDayAndChild(child_id, new Date(date));
  });

  ipcMain.handle('updateUser', async (event, user) => {
    return databaseService.updateUser(user);
  });

  ipcMain.handle('updatePassword', async (event, user) => {
    return databaseService.updatePassword(user);
  });

  ipcMain.handle('updateChild', async (event, child) => {
    return databaseService.updateChild(child);
  });

  ipcMain.handle('updateMetric', async (event, metric) => {
    return databaseService.updateMetric(metric);
  });

  ipcMain.handle('updateEvent', async (event, eventData) => {
    return databaseService.updateEvent(eventData);
  });

  ipcMain.handle('updateNote', async (event, note) => {
    return databaseService.updateNote(note);
  });

  ipcMain.handle('deleteNote', async (event, note_id) => {
    return databaseService.deleteNote(note_id);
  });

  ipcMain.handle('deleteMetric', async (event, metric_id) => {
    return databaseService.deleteMetric(metric_id);
  });

  ipcMain.handle('deleteEvent', async (event, event_id) => {
    return databaseService.deleteEvent(event_id);
  });

  ipcMain.handle('getWeightMetrics', async (event) => {
    return databaseService.getWeightMetrics();
  });

  ipcMain.handle('getHeightMetrics', async (event) => {
    return databaseService.getHeightMetrics();
  });

  ipcMain.handle('getFeedingMetrics', async (event) => {
    return databaseService.getFeedingMetrics();
  });

  ipcMain.handle('getSleepMetrics', async (event) => {
    return databaseService.getSleepMetrics();
  });

  ipcMain.handle('getWeightMetricsInRange', async (event, startDate, endDate) => {
    return databaseService.getWeightMetricsInRange(startDate, endDate);
  });

  ipcMain.handle('getHeightMetricsInRange', async (event, startDate, endDate) => {
    return databaseService.getHeightMetricsInRange(startDate, endDate);
  });

  ipcMain.handle('getFeedingMetricsInRange', async (event, startDate, endDate) => {
    return databaseService.getFeedingMetricsInRange(startDate, endDate);
  });

  ipcMain.handle('getSleepMetricsInRange', async (event, startDate, endDate) => {
    return databaseService.getSleepMetricsInRange(startDate, endDate);
  });

  ipcMain.handle('getFeedingByDayAndChild', async (event, child_id, date) => {
    return databaseService.getFeedingByDayAndChild(child_id, new Date(date));
  });

  ipcMain.handle('getSleepByDayAndChild', async (event, child_id, date) => {
    return databaseService.getSleepByDayAndChild(child_id, new Date(date));
  });
}
