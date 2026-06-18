const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createUser: (user) => 
    ipcRenderer.invoke('createUser', user),
  getUserById: (user_id) => 
    ipcRenderer.invoke('getUserById', user_id),
  getUserByUsername: (username) => 
    ipcRenderer.invoke('getUserByUsername', username),
  
  createChild: (child) => 
    ipcRenderer.invoke('createChild', child),
  getChildrenByUserId: (user_id) => 
    ipcRenderer.invoke('getChildrenByUserId', user_id),
  
  createEvent: (event) =>
    ipcRenderer.invoke('createEvent', event),
  getEvent: (event_id) =>
    ipcRenderer.invoke('getEvent', event_id),
  getEventsByChildId: (child_id) =>
    ipcRenderer.invoke('getEventsByChildId', child_id),
  
  createMetric: (metric) =>
    ipcRenderer.invoke('createMetric', metric),
  getMetric: (metric_id) =>
    ipcRenderer.invoke('getMetric', metric_id),
  getMetricsByChildId: (child_id) =>
    ipcRenderer.invoke('getMetricsByChildId', child_id),
  
  createNote: (note) =>
    ipcRenderer.invoke('createNote', note),
  getNotesByMetricId: (metric_id) =>
    ipcRenderer.invoke('getNotesByMetricId', metric_id),
  getNotesByEventId: (event_id) =>
    ipcRenderer.invoke('getNotesByEventId', event_id),
  getNotesByDayAndChild: (child_id, date) =>
    ipcRenderer.invoke('getNotesByDayAndChild', child_id, date.toISOString()),
  getFeedingByDayAndChild: (child_id, date) =>
    ipcRenderer.invoke('getFeedingByDayAndChild', child_id, date.toISOString()),
  getSleepByDayAndChild: (child_id, date) =>
    ipcRenderer.invoke('getSleepByDayAndChild', child_id, date.toISOString()),

  getFeedingCountByDayAndChild: (child_id, date) =>
    ipcRenderer.invoke('getFeedingCountByDayAndChild', child_id, date),
  getSleepCountByDayAndChild: (child_id, date) =>
    ipcRenderer.invoke('getSleepCountByDayAndChild', child_id, date),
  getLastWeightByChildBeforeDate: (child_id, date) =>
    ipcRenderer.invoke('getLastWeightByChildBeforeDate', child_id, date.toISOString()),
  getLastHeightByChildBeforeDate: (child_id, date) =>
    ipcRenderer.invoke('getLastHeightByChildBeforeDate', child_id, date.toISOString()),
  getUpcomingEventsByDayAndChild: (child_id, date) =>
    ipcRenderer.invoke('getUpcomingEventsByDayAndChild', child_id, date.toISOString()),

  updateUser: (user) =>
    ipcRenderer.invoke('updateUser', user),
  updateChild: (child) =>
    ipcRenderer.invoke('updateChild', child),
  updateMetric: (metric) =>
    ipcRenderer.invoke('updateMetric', metric),
  updateEvent: (event) =>
    ipcRenderer.invoke('updateEvent', event),
  updateNote: (note) =>
    ipcRenderer.invoke('updateNote', note),
  updatePassword: (user) =>
    ipcRenderer.invoke('updatePassword', user),

  deleteNote: (note_id) =>
    ipcRenderer.invoke('deleteNote', note_id),
  deleteMetric: (metric_id) =>
    ipcRenderer.invoke('deleteMetric', metric_id),
  deleteEvent: (event_id) =>
    ipcRenderer.invoke('deleteEvent', event_id),

  getWeightMetrics: () =>
    ipcRenderer.invoke('getWeightMetrics'),
  getHeightMetrics: () =>
    ipcRenderer.invoke('getHeightMetrics'),
  getFeedingMetrics: () =>
    ipcRenderer.invoke('getFeedingMetrics'),
  getSleepMetrics: () =>
    ipcRenderer.invoke('getSleepMetrics'),

  getWeightMetricsInRange: (startDate, endDate) =>
    ipcRenderer.invoke('getWeightMetricsInRange', startDate, endDate),
  getHeightMetricsInRange: (startDate, endDate) =>
    ipcRenderer.invoke('getHeightMetricsInRange', startDate, endDate),
  getFeedingMetricsInRange: (startDate, endDate) =>
    ipcRenderer.invoke('getFeedingMetricsInRange', startDate, endDate),
  getSleepMetricsInRange: (startDate, endDate) =>
    ipcRenderer.invoke('getSleepMetricsInRange', startDate, endDate),

  getFeedingByDayAndChild: (child_id, date) =>
    ipcRenderer.invoke('getFeedingByDayAndChild', child_id, date),
  getSleepByDayAndChild: (child_id, date) =>
    ipcRenderer.invoke('getSleepByDayAndChild', child_id, date)
});
