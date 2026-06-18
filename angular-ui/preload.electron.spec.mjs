import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockContextBridge, mockIpcRenderer } = vi.hoisted(() => {
  return {
    mockContextBridge: {
      exposeInMainWorld: vi.fn(),
    },
    mockIpcRenderer: {
      invoke: vi.fn(),
    },
  };
});

vi.mock('electron', () => ({
  contextBridge: mockContextBridge,
  ipcRenderer: mockIpcRenderer,
}));

describe('preload.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should expose electronAPI to main world', async () => {
    await import('./preload.js');

    expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalledWith(
      'electronAPI',
      expect.any(Object)
    );
  });

  it('should have all required API methods', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    expect(electronAPI).toHaveProperty('createUser');
    expect(electronAPI).toHaveProperty('getUserById');
    expect(electronAPI).toHaveProperty('getUserByUsername');
    expect(electronAPI).toHaveProperty('createChild');
    expect(electronAPI).toHaveProperty('getChildrenByUserId');
    expect(electronAPI).toHaveProperty('createEvent');
    expect(electronAPI).toHaveProperty('getEvent');
    expect(electronAPI).toHaveProperty('getEventsByChildId');
    expect(electronAPI).toHaveProperty('createMetric');
    expect(electronAPI).toHaveProperty('getMetric');
    expect(electronAPI).toHaveProperty('getMetricsByChildId');
    expect(electronAPI).toHaveProperty('createNote');
    expect(electronAPI).toHaveProperty('getNotesByMetricId');
    expect(electronAPI).toHaveProperty('getNotesByEventId');
    expect(electronAPI).toHaveProperty('getNotesByDayAndChild');
    expect(electronAPI).toHaveProperty('getFeedingByDayAndChild');
    expect(electronAPI).toHaveProperty('getSleepByDayAndChild');
    expect(electronAPI).toHaveProperty('updateUser');
    expect(electronAPI).toHaveProperty('updateChild');
    expect(electronAPI).toHaveProperty('updateMetric');
    expect(electronAPI).toHaveProperty('updateEvent');
    expect(electronAPI).toHaveProperty('updateNote');
    expect(electronAPI).toHaveProperty('updatePassword');
    expect(electronAPI).toHaveProperty('deleteNote');
    expect(electronAPI).toHaveProperty('deleteMetric');
    expect(electronAPI).toHaveProperty('deleteEvent');
    expect(electronAPI).toHaveProperty('getWeightMetrics');
    expect(electronAPI).toHaveProperty('getHeightMetrics');
    expect(electronAPI).toHaveProperty('getFeedingMetrics');
    expect(electronAPI).toHaveProperty('getSleepMetrics');
  });

  it('should invoke correct IPC channel for createUser', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.createUser({ username: 'test' });

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('createUser', { username: 'test' });
  });

  it('should invoke correct IPC channel for getUserById', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.getUserById(1);

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('getUserById', 1);
  });

  it('should invoke correct IPC channel for createChild', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.createChild({ name: 'test' });

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('createChild', { name: 'test' });
  });

  it('should invoke correct IPC channel for createEvent', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.createEvent({ name: 'test' });

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('createEvent', { name: 'test' });
  });

  it('should invoke correct IPC channel for createMetric', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.createMetric({ value: 10 });

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('createMetric', { value: 10 });
  });

  it('should invoke correct IPC channel for createNote', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.createNote({ record: 'test' });

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('createNote', { record: 'test' });
  });

  it('should convert date to ISO string for getNotesByDayAndChild', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    const date = new Date('2024-01-15');
    electronAPI.getNotesByDayAndChild(1, date);

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('getNotesByDayAndChild', 1, date.toISOString());
  });

  it('should invoke correct IPC channel for updateUser', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.updateUser({ username: 'updated' });

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('updateUser', { username: 'updated' });
  });

  it('should invoke correct IPC channel for deleteNote', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.deleteNote(1);

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('deleteNote', 1);
  });

  it('should invoke correct IPC channel for getWeightMetrics', async () => {
    await import('./preload.js');

    const apiCall = mockContextBridge.exposeInMainWorld.mock.calls[0];
    const electronAPI = apiCall[1];

    electronAPI.getWeightMetrics();

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('getWeightMetrics');
  });
});
