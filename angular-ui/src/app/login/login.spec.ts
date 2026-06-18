import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { Login } from './login';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Child, Gender } from '../../models/child';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockDatabaseService: any;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockDatabaseService = {
      getUserByUsername: vi.fn(),
      getChildrenByUserId: vi.fn(),
    };

    mockAuthService = {
      verifyPassword: vi.fn(),
      login: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        FormBuilder,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with required fields', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should show error message when form is invalid on login', async () => {
    component.loginForm.setValue({ username: '', password: '' });
    await component.login();

    expect(component.errorMessage).toBe('Please fill in all fields');
  });

  it('should show error message when user not found', async () => {
    component.loginForm.setValue({ username: 'nonexistent', password: 'password123' });
    mockDatabaseService.getUserByUsername.mockResolvedValue(null);

    await component.login();

    expect(component.errorMessage).toBe('Invalid username or password');
  });

  it('should show error message when password is incorrect', async () => {
    const user: User = {
      user_id: 1,
      username: 'testuser',
      password: 'hashed',
      salt: 'salt',
      first_name: 'Test',
      last_name: 'User',
      email_addr: 'test@example.com',
    };
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpassword' });
    mockDatabaseService.getUserByUsername.mockResolvedValue(user);
    mockAuthService.verifyPassword.mockResolvedValue(false);

    await component.login();

    expect(component.errorMessage).toBe('Invalid username or password');
  });

  it('should login successfully and navigate to summary', async () => {
    const user: User = {
      user_id: 1,
      username: 'testuser',
      password: 'hashed',
      salt: 'salt',
      first_name: 'Test',
      last_name: 'User',
      email_addr: 'test@example.com',
    };
    const child: Child = {
      child_id: 1,
      user_id: 1,
      first_name: 'Test',
      last_name: 'Child',
      gender: Gender.Male,
      birthday: new Date('2024-01-01'),
    };
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    mockDatabaseService.getUserByUsername.mockResolvedValue(user);
    mockAuthService.verifyPassword.mockResolvedValue(true);
    mockDatabaseService.getChildrenByUserId.mockResolvedValue([child]);

    await component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith(user, child);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/summary']);
    expect(component.errorMessage).toBe('');
  });

  it('should login successfully without child when no children exist', async () => {
    const user: User = {
      user_id: 1,
      username: 'testuser',
      password: 'hashed',
      salt: 'salt',
      first_name: 'Test',
      last_name: 'User',
      email_addr: 'test@example.com',
    };
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    mockDatabaseService.getUserByUsername.mockResolvedValue(user);
    mockAuthService.verifyPassword.mockResolvedValue(true);
    mockDatabaseService.getChildrenByUserId.mockResolvedValue([]);

    await component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith(user, null);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/summary']);
  });

  it('should show error message when login throws error', async () => {
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    mockDatabaseService.getUserByUsername.mockRejectedValue(new Error('Database error'));

    await component.login();

    expect(component.errorMessage).toBe('An error occurred during login');
  });

  it('should navigate to signup on register', () => {
    component.register();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/signup']);
  });
});
