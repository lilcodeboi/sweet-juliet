import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockSqlJs, mockFs, mockPath } = vi.hoisted(() => {
  return {
    mockSqlJs: {
      Database: vi.fn(),
    },
    mockFs: {
      existsSync: vi.fn(),
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
    },
    mockPath: {
      join: vi.fn((...args) => args.join('/')),
    },
  };
});

vi.mock('sql.js', () => ({
  default: vi.fn(() => ({ Database: mockSqlJs.Database })),
}));

vi.mock('fs', () => ({
  existsSync: mockFs.existsSync,
  readFileSync: mockFs.readFileSync,
  writeFileSync: mockFs.writeFileSync,
}));

vi.mock('path', () => ({
  join: mockPath.join,
}));

describe('database.service.js', () => {
  let DatabaseService;

  beforeEach(async () => {
    mockSqlJs.Database = vi.fn();
    mockFs.existsSync = vi.fn();
    mockFs.readFileSync = vi.fn();
    mockFs.writeFileSync = vi.fn();
    mockPath.join = vi.fn((...args) => args.join('/'));

    vi.clearAllMocks();

    const module = await import('./database.service.js');
    DatabaseService = module.DatabaseService;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize database on construction', async () => {
    const mockDb = {
      run: vi.fn(),
      exec: vi.fn(),
      export: vi.fn(() => new Uint8Array()),
    };

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(new ArrayBuffer());
    mockSqlJs.Database.mockReturnValue(mockDb);
    mockFs.readFileSync.mockImplementation((path) => {
      if (path.includes('schema.sql')) return 'CREATE TABLE test (id INTEGER);';
      return new ArrayBuffer();
    });

    const service = new DatabaseService();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(service).toBeTruthy();
  });

  it('should throw error if database not initialized', () => {
    const service = new DatabaseService();
    service.db = null;

    expect(() => service.createUser({})).toThrow('Database not initialized');
  });

  it('should create user and return id', () => {
    const mockDb = {
      run: vi.fn(),
      exec: vi.fn(() => [{ values: [[1]] }]),
      export: vi.fn(() => new Uint8Array()),
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const id = service.createUser({
      username: 'test',
      password: 'hash',
      salt: 'salt',
      first_name: 'Test',
      last_name: 'User',
      email_addr: 'test@example.com'
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.any(Array)
    );
    expect(mockDb.exec).toHaveBeenCalledWith('SELECT last_insert_rowid() as id');
    expect(id).toBe(1);
  });

  it('should get user by id', () => {
    const mockDb = {
      exec: vi.fn(() => [{
        columns: ['user_id', 'username'],
        values: [[1, 'testuser']]
      }])
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const user = service.getUserById(1);

    expect(mockDb.exec).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = ?', [1]);
    expect(user).toEqual({ user_id: 1, username: 'testuser' });
  });

  it('should return null if user not found', () => {
    const mockDb = {
      exec: vi.fn(() => [])
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const user = service.getUserById(999);

    expect(user).toBeNull();
  });

  it('should get user by username', () => {
    const mockDb = {
      exec: vi.fn(() => [{
        columns: ['user_id', 'username'],
        values: [[1, 'testuser']]
      }])
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const user = service.getUserByUsername('testuser');

    expect(mockDb.exec).toHaveBeenCalledWith('SELECT * FROM users WHERE username = ?', ['testuser']);
    expect(user).toEqual({ user_id: 1, username: 'testuser' });
  });

  it('should create child and return id', () => {
    const mockDb = {
      run: vi.fn(),
      exec: vi.fn(() => [{ values: [[1]] }]),
      export: vi.fn(() => new Uint8Array()),
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const id = service.createChild({
      first_name: 'Test',
      last_name: 'Child',
      gender: 'Male',
      user_id: 1,
      birthday: '2024-01-01'
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO children'),
      expect.any(Array)
    );
    expect(id).toBe(1);
  });

  it('should get children by user id', () => {
    const mockDb = {
      exec: vi.fn(() => [{
        columns: ['child_id', 'first_name'],
        values: [[1, 'Test'], [2, 'Another']]
      }])
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const children = service.getChildrenByUserId(1);

    expect(mockDb.exec).toHaveBeenCalledWith('SELECT * FROM children WHERE user_id = ?', [1]);
    expect(children).toHaveLength(2);
    expect(children[0]).toEqual({ child_id: 1, first_name: 'Test' });
  });

  it('should create event and return id', () => {
    const mockDb = {
      run: vi.fn(),
      exec: vi.fn(() => [{ values: [[1]] }]),
      export: vi.fn(() => new Uint8Array()),
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const id = service.createEvent({
      event_name: 'Test Event',
      event_start_date_time: '2024-01-01T10:00:00',
      event_duration: 60,
      event_type: 0,
      child_id: 1
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO events'),
      expect.any(Array)
    );
    expect(id).toBe(1);
  });

  it('should get events by child id', () => {
    const mockDb = {
      exec: vi.fn(() => [{
        columns: ['event_id', 'event_name'],
        values: [[1, 'Test Event']]
      }])
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const events = service.getEventsByChildId(1);

    expect(mockDb.exec).toHaveBeenCalledWith('SELECT * FROM events WHERE child_id = ?', [1]);
    expect(events).toHaveLength(1);
  });

  it('should create metric and return id', () => {
    const mockDb = {
      run: vi.fn(),
      exec: vi.fn(() => [{ values: [[1]] }]),
      export: vi.fn(() => new Uint8Array()),
    };

    const service = new DatabaseService();
    service.db = mockDb;

    const id = service.createMetric({
      metric_date_time: '2024-01-01T10:00:00',
      metric_type: 0,
      child_id: 1,
      metric_record: 10
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO metrics'),
      expect.any(Array)
    );
    expect(id).toBe(1);
  });

  it('should update user', () => {
    const mockDb = {
      run: vi.fn(),
      export: vi.fn(() => new Uint8Array()),
    };

    const service = new DatabaseService();
    service.db = mockDb;

    service.updateUser({
      user_id: 1,
      username: 'updated',
      password: 'hash',
      first_name: 'Updated',
      last_name: 'User',
      email_addr: 'updated@example.com'
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users'),
      expect.any(Array)
    );
  });

  it('should update password', () => {
    const mockDb = {
      run: vi.fn(),
      export: vi.fn(() => new Uint8Array()),
    };

    const service = new DatabaseService();
    service.db = mockDb;

    service.updatePassword({
      user_id: 1,
      password: 'newhash',
      salt: 'newsalt'
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users'),
      expect.any(Array)
    );
  });

  it('should update child', () => {
    const mockDb = {
      run: vi.fn(),
      export: vi.fn(() => new Uint8Array()),
    };

    const service = new DatabaseService();
    service.db = mockDb;

    service.updateChild({
      child_id: 1,
      first_name: 'Updated',
      last_name: 'Child',
      gender: 'Male',
      user_id: 1,
      birthday: '2024-01-01'
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE children'),
      expect.any(Array)
    );
  });

  it('should close database', () => {
    const service = new DatabaseService();
    const mockClose = vi.fn();
    service.db = { close: mockClose, export: vi.fn(() => new Uint8Array()) };

    service.close();

    expect(mockClose).toHaveBeenCalled();
  });
});
