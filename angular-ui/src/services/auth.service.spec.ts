import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isLoggedIn signal', () => {
    it('should be false initially when no user in localStorage', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should be true when user exists in localStorage', () => {
      localStorage.setItem('currentUser', JSON.stringify({ username: 'test' }));
      TestBed.resetTestingModule();
      const newService = TestBed.inject(AuthService);
      expect(newService.isLoggedIn()).toBe(true);
    });
  });

  describe('login', () => {
    it('should store user in localStorage and set isLoggedIn to true', () => {
      const user = { username: 'testuser', user_id: 1 };
      service.login(user);
      
      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(user));
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should store child in localStorage when provided', () => {
      const user = { username: 'testuser', user_id: 1 };
      const child = { name: 'testchild', child_id: 1 };
      service.login(user, child);
      
      expect(localStorage.getItem('currentChild')).toBe(JSON.stringify(child));
    });

    it('should not store child in localStorage when not provided', () => {
      const user = { username: 'testuser', user_id: 1 };
      service.login(user);
      
      expect(localStorage.getItem('currentChild')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should remove user and child from localStorage and set isLoggedIn to false', () => {
      const user = { username: 'testuser', user_id: 1 };
      const child = { name: 'testchild', child_id: 1 };
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('currentChild', JSON.stringify(child));
      
      service.logout();
      
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(localStorage.getItem('currentChild')).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from localStorage when exists', () => {
      const user = { username: 'testuser', user_id: 1 };
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      const result = service.getCurrentUser();
      
      expect(result).toEqual(user);
    });

    it('should return null when no user in localStorage', () => {
      const result = service.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('getCurrentChild', () => {
    it('should return child from localStorage when exists', () => {
      const child = { name: 'testchild', child_id: 1 };
      localStorage.setItem('currentChild', JSON.stringify(child));
      
      const result = service.getCurrentChild();
      
      expect(result).toEqual(child);
    });

    it('should return null when no child in localStorage', () => {
      const result = service.getCurrentChild();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('should return hash and salt', async () => {
      const password = 'testpassword';
      const result = await service.hashPassword(password);
      
      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('salt');
      expect(typeof result.hash).toBe('string');
      expect(typeof result.salt).toBe('string');
      expect(result.hash.length).toBeGreaterThan(0);
      expect(result.salt.length).toBeGreaterThan(0);
    });

    it('should generate different salts for same password', async () => {
      const password = 'testpassword';
      const result1 = await service.hashPassword(password);
      const result2 = await service.hashPassword(password);
      
      expect(result1.salt).not.toBe(result2.salt);
    });

    it('should generate different hashes for same password due to salt', async () => {
      const password = 'testpassword';
      const result1 = await service.hashPassword(password);
      const result2 = await service.hashPassword(password);
      
      expect(result1.hash).not.toBe(result2.hash);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testpassword';
      const { hash, salt } = await service.hashPassword(password);
      
      const result = await service.verifyPassword(password, hash, salt);
      
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testpassword';
      const { hash, salt } = await service.hashPassword(password);
      
      const result = await service.verifyPassword('wrongpassword', hash, salt);
      
      expect(result).toBe(false);
    });

    it('should return false for empty password', async () => {
      const password = 'testpassword';
      const { hash, salt } = await service.hashPassword(password);
      
      const result = await service.verifyPassword('', hash, salt);
      
      expect(result).toBe(false);
    });
  });
});
