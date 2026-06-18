import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockApp, mockBrowserWindow, mockMenu, mockIpcMain, mockDatabaseService } = vi.hoisted(() => {
  return {
    mockApp: {
      quit: vi.fn(),
      whenReady: vi.fn(() => Promise.resolve()),
      on: vi.fn(),
    },
    mockBrowserWindow: vi.fn(),
    mockMenu: {
      setApplicationMenu: vi.fn(),
    },
    mockIpcMain: {
      handle: vi.fn(),
    },
    mockDatabaseService: {
      close: vi.fn(),
      createUser: vi.fn(),
      getUserById: vi.fn(),
      getUserByUsername: vi.fn(),
      createChild: vi.fn(),
      getChildrenByUserId: vi.fn(),
      createEvent: vi.fn(),
      getEvent: vi.fn(),
      getEventsByChildId: vi.fn(),
      createMetric: vi.fn(),
      getMetric: vi.fn(),
      getMetricsByChildId: vi.fn(),
      createNote: vi.fn(),
      getNotesByMetricId: vi.fn(),
      getNotesByEventId: vi.fn(),
      getNotesByDayAndChild: vi.fn(),
      getFeedingCountByDayAndChild: vi.fn(),
      getSleepCountByDayAndChild: vi.fn(),
      getLastWeightByChildBeforeDate: vi.fn(),
      getLastHeightByChildBeforeDate: vi.fn(),
      getUpcomingEventsByDayAndChild: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      updateChild: vi.fn(),
      updateMetric: vi.fn(),
      updateEvent: vi.fn(),
      updateNote: vi.fn(),
      deleteNote: vi.fn(),
      deleteMetric: vi.fn(),
      deleteEvent: vi.fn(),
      getWeightMetrics: vi.fn(),
      getHeightMetrics: vi.fn(),
      getFeedingMetrics: vi.fn(),
      getSleepMetrics: vi.fn(),
      getWeightMetricsInRange: vi.fn(),
      getHeightMetricsInRange: vi.fn(),
      getFeedingMetricsInRange: vi.fn(),
      getSleepMetricsInRange: vi.fn(),
      getFeedingByDayAndChild: vi.fn(),
      getSleepByDayAndChild: vi.fn(),
    },
  };
});

vi.mock('electron', () => ({
  app: mockApp,
  BrowserWindow: mockBrowserWindow,
  Menu: mockMenu,
  ipcMain: mockIpcMain,
}));

vi.mock('electron-squirrel-startup', () => false);

vi.mock('./database/database.service.js', () => ({
  DatabaseService: vi.fn(() => mockDatabaseService),
}));

describe('main.js', () => {
  beforeEach(() => {
    mockBrowserWindow.prototype = {
      loadFile: vi.fn(),
      webContents: {
        openDevTools: vi.fn(),
      },
    };

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set up IPC handlers for all database operations', async () => {
    await import('./main.js');

    expect(mockIpcMain.handle).toHaveBeenCalledWith('createUser', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getUserById', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getUserByUsername', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('createChild', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getChildrenByUserId', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('createEvent', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getEvent', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getEventsByChildId', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('createMetric', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getMetric', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getMetricsByChildId', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('createNote', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getNotesByMetricId', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getNotesByEventId', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getNotesByDayAndChild', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getFeedingCountByDayAndChild', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getSleepCountByDayAndChild', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getLastWeightByChildBeforeDate', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getLastHeightByChildBeforeDate', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getUpcomingEventsByDayAndChild', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('updateUser', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('updatePassword', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('updateChild', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('updateMetric', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('updateEvent', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('updateNote', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('deleteNote', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('deleteMetric', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('deleteEvent', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getWeightMetrics', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getHeightMetrics', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getFeedingMetrics', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getSleepMetrics', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getWeightMetricsInRange', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getHeightMetricsInRange', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getFeedingMetricsInRange', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getSleepMetricsInRange', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getFeedingByDayAndChild', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('getSleepByDayAndChild', expect.any(Function));
  });

  it('should call database service methods when IPC handlers are invoked', async () => {
    await import('./main.js');

    const createUserHandler = mockIpcMain.handle.mock.calls.find(call => call[0] === 'createUser')[1];
    await createUserHandler(null, { username: 'test' });

    expect(mockDatabaseService.createUser).toHaveBeenCalledWith({ username: 'test' });
  });

  it('should convert date string to Date object for getNotesByDayAndChild', async () => {
    await import('./main.js');

    const handler = mockIpcMain.handle.mock.calls.find(call => call[0] === 'getNotesByDayAndChild')[1];
    await handler(null, 1, '2024-01-15');

    expect(mockDatabaseService.getNotesByDayAndChild).toHaveBeenCalledWith(1, expect.any(Date));
  });

  it('should convert date string to Date object for getLastWeightByChildBeforeDate', async () => {
    await import('./main.js');

    const handler = mockIpcMain.handle.mock.calls.find(call => call[0] === 'getLastWeightByChildBeforeDate')[1];
    await handler(null, 1, '2024-01-15');

    expect(mockDatabaseService.getLastWeightByChildBeforeDate).toHaveBeenCalledWith(1, expect.any(Date));
  });

  it('should convert date string to Date object for getFeedingByDayAndChild', async () => {
    await import('./main.js');

    const handler = mockIpcMain.handle.mock.calls.find(call => call[0] === 'getFeedingByDayAndChild')[1];
    await handler(null, 1, '2024-01-15');

    expect(mockDatabaseService.getFeedingByDayAndChild).toHaveBeenCalledWith(1, expect.any(Date));
  });

  it('should convert date string to Date object for getSleepByDayAndChild', async () => {
    await import('./main.js');

    const handler = mockIpcMain.handle.mock.calls.find(call => call[0] === 'getSleepByDayAndChild')[1];
    await handler(null, 1, '2024-01-15');

    expect(mockDatabaseService.getSleepByDayAndChild).toHaveBeenCalledWith(1, expect.any(Date));
  });

  it('should set up window-all-closed handler', async () => {
    await import('./main.js');

    expect(mockApp.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function));
  });

  it('should close database and quit app on window-all-closed (non-darwin)', async () => {
    await import('./main.js');

    const handler = mockApp.on.mock.calls.find(call => call[0] === 'window-all-closed')[1];
    
    Object.defineProperty(process, 'platform', { value: 'win32' });
    handler();

    expect(mockDatabaseService.close).toHaveBeenCalled();
    expect(mockApp.quit).toHaveBeenCalled();
  });

  it('should not quit app on window-all-closed (darwin)', async () => {
    await import('./main.js');

    const handler = mockApp.on.mock.calls.find(call => call[0] === 'window-all-closed')[1];
    
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    handler();

    expect(mockDatabaseService.close).not.toHaveBeenCalled();
    expect(mockApp.quit).not.toHaveBeenCalled();
  });
});
