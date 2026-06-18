import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { Signup } from './signup';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../models/user';
import { Child, Gender } from '../../models/child';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let mockDatabaseService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockDatabaseService = {
      getUserByUsername: vi.fn(),
      createUser: vi.fn(),
      createChild: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        FormBuilder,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signup form with required fields', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.get('firstName')).toBeDefined();
    expect(component.signupForm.get('lastName')).toBeDefined();
    expect(component.signupForm.get('email')).toBeDefined();
    expect(component.signupForm.get('username')).toBeDefined();
    expect(component.signupForm.get('password')).toBeDefined();
    expect(component.signupForm.get('confirmPassword')).toBeDefined();
    expect(component.signupForm.get('childFName')).toBeDefined();
    expect(component.signupForm.get('childLName')).toBeDefined();
    expect(component.signupForm.get('childBirthDate')).toBeDefined();
    expect(component.signupForm.get('childGender')).toBeDefined();
  });

  it('should show error message when form is invalid on register', async () => {
    component.signupForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      childFName: '',
      childLName: '',
      childBirthDate: '',
      childGender: 0,
    });
    await component.register();

    expect(component.errorMessage).toBe('Please fill in all fields correctly');
  });

  it('should show error message when username already exists', async () => {
    const user: User = {
      user_id: 1,
      username: 'existinguser',
      password: 'hashed',
      salt: 'salt',
      first_name: 'Test',
      last_name: 'User',
      email_addr: 'test@example.com',
    };
    component.signupForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      username: 'existinguser',
      password: 'password123',
      confirmPassword: 'password123',
      childFName: 'Test',
      childLName: 'Child',
      childBirthDate: '2024-01-01',
      childGender: 0,
    });
    mockDatabaseService.getUserByUsername.mockResolvedValue(user);

    await component.register();

    expect(component.errorMessage).toBe('Username already exists');
  });

  it('should show error message when passwords do not match', async () => {
    component.signupForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'different',
      childFName: 'Test',
      childLName: 'Child',
      childBirthDate: '2024-01-01',
      childGender: 0,
    });
    mockDatabaseService.getUserByUsername.mockResolvedValue(null);

    await component.register();

    expect(component.errorMessage).toBe('Passwords do not match');
  });

  it('should register successfully and navigate to login', async () => {
    component.signupForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'password123',
      childFName: 'Test',
      childLName: 'Child',
      childBirthDate: '2024-01-01',
      childGender: 0,
    });
    mockDatabaseService.getUserByUsername.mockResolvedValue(null);
    mockDatabaseService.createUser.mockResolvedValue(1);
    mockDatabaseService.createChild.mockResolvedValue(1);

    await component.register();

    expect(mockDatabaseService.createUser).toHaveBeenCalled();
    expect(mockDatabaseService.createChild).toHaveBeenCalled();
    expect(component.successMessage).toBe('Registration successful! Redirecting to login...');
  });

  it('should show error message when registration throws error', async () => {
    component.signupForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'password123',
      childFName: 'Test',
      childLName: 'Child',
      childBirthDate: '2024-01-01',
      childGender: 0,
    });
    mockDatabaseService.getUserByUsername.mockRejectedValue(new Error('Database error'));

    await component.register();

    expect(component.errorMessage).toBe('An error occurred during registration');
  });

  it('should navigate to login on login', () => {
    component.login();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
