import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { Profile } from './profile';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Child, Gender } from '../../models/child';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let mockDatabaseService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockDatabaseService = {
      updateUser: vi.fn(),
      updateChild: vi.fn(),
      updatePassword: vi.fn(),
    };

    mockAuthService = {
      getCurrentUser: vi.fn(),
      getCurrentChild: vi.fn(),
      hashPassword: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        FormBuilder,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
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
    mockAuthService.getCurrentUser.mockReturnValue(user);
    mockAuthService.getCurrentChild.mockReturnValue(child);

    component.ngOnInit();

    expect(component.userForm).toBeDefined();
    expect(component.childForm).toBeDefined();
    expect(component.passwordForm).toBeDefined();
    expect(component.userForm.value.firstName).toBe('Test');
    expect(component.userForm.value.lastName).toBe('User');
    expect(component.userForm.value.username).toBe('testuser');
    expect(component.userForm.value.email).toBe('test@example.com');
    expect(component.childForm.value.firstName).toBe('Test');
    expect(component.childForm.value.lastName).toBe('Child');
    expect(component.childForm.value.gender).toBe(Gender.Male);
  });

  it('should disable forms on initialization', () => {
    mockAuthService.getCurrentUser.mockReturnValue(null);
    mockAuthService.getCurrentChild.mockReturnValue(null);

    component.ngOnInit();

    expect(component.userForm.disabled).toBe(true);
    expect(component.childForm.disabled).toBe(true);
    expect(component.passwordForm.disabled).toBe(true);
  });

  it('should enable user form on edit', () => {
    component.ngOnInit();
    component.onUserEdit();

    expect(component.userForm.enabled).toBe(true);
  });

  it('should enable child form on edit', () => {
    component.ngOnInit();
    component.onChildEdit();

    expect(component.childForm.enabled).toBe(true);
  });

  it('should enable password form on edit', () => {
    component.ngOnInit();
    component.onPasswordEdit();

    expect(component.passwordForm.enabled).toBe(true);
  });

  it('should submit user form and disable it', async () => {
    const user: User = {
      user_id: 1,
      username: 'testuser',
      password: 'hashed',
      salt: 'salt',
      first_name: 'Test',
      last_name: 'User',
      email_addr: 'test@example.com',
    };
    mockAuthService.getCurrentUser.mockReturnValue(user);
    component.ngOnInit();
    component.userForm.enable();
    mockDatabaseService.updateUser.mockResolvedValue(undefined);

    await component.onUserSubmit();

    expect(mockDatabaseService.updateUser).toHaveBeenCalled();
    expect(component.userForm.disabled).toBe(true);
  });

  it('should submit child form and disable it', async () => {
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
    mockAuthService.getCurrentUser.mockReturnValue(user);
    mockAuthService.getCurrentChild.mockReturnValue(child);
    component.ngOnInit();
    component.childForm.enable();
    mockDatabaseService.updateChild.mockResolvedValue(undefined);

    await component.onChildSubmit();

    expect(mockDatabaseService.updateChild).toHaveBeenCalled();
    expect(component.childForm.disabled).toBe(true);
  });

  it('should submit both user and child forms on save', async () => {
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
    mockAuthService.getCurrentUser.mockReturnValue(user);
    mockAuthService.getCurrentChild.mockReturnValue(child);
    component.ngOnInit();
    component.userForm.enable();
    component.childForm.enable();
    mockDatabaseService.updateUser.mockResolvedValue(undefined);
    mockDatabaseService.updateChild.mockResolvedValue(undefined);

    await component.onSave();

    expect(mockDatabaseService.updateUser).toHaveBeenCalled();
    expect(mockDatabaseService.updateChild).toHaveBeenCalled();
  });

  it('should not save if forms are invalid', async () => {
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
    mockAuthService.getCurrentUser.mockReturnValue(user);
    mockAuthService.getCurrentChild.mockReturnValue(child);
    component.ngOnInit();
    component.userForm.enable();
    component.childForm.enable();
    component.userForm.get('firstName')?.setValue('');
    component.userForm.get('firstName')?.markAsDirty();
    component.userForm.get('firstName')?.markAsTouched();
    mockDatabaseService.updateUser.mockResolvedValue(undefined);

    await component.onSave();

    expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
  });

  it('should submit password form and disable it', async () => {
    const user: User = {
      user_id: 1,
      username: 'testuser',
      password: 'hashed',
      salt: 'salt',
      first_name: 'Test',
      last_name: 'User',
      email_addr: 'test@example.com',
    };
    mockAuthService.getCurrentUser.mockReturnValue(user);
    component.ngOnInit();
    component.passwordForm.setValue({ password: 'newpassword', confirmPassword: 'newpassword' });
    component.passwordForm.enable();
    mockAuthService.hashPassword.mockResolvedValue({ hash: 'newhash', salt: 'newsalt' });
    mockDatabaseService.updatePassword.mockResolvedValue(undefined);

    await component.onPasswordSubmit();

    expect(mockAuthService.hashPassword).toHaveBeenCalledWith('newpassword');
    expect(mockDatabaseService.updatePassword).toHaveBeenCalled();
    expect(component.passwordForm.disabled).toBe(true);
  });

  it('should not submit password if form is invalid', async () => {
    const user: User = {
      user_id: 1,
      username: 'testuser',
      password: 'hashed',
      salt: 'salt',
      first_name: 'Test',
      last_name: 'User',
      email_addr: 'test@example.com',
    };
    mockAuthService.getCurrentUser.mockReturnValue(user);
    mockAuthService.hashPassword = vi.fn().mockResolvedValue({ hash: 'newhash', salt: 'newsalt' });
    component.ngOnInit();
    component.passwordForm.enable();
    component.passwordForm.get('password')?.setValue('');
    component.passwordForm.get('password')?.markAsDirty();
    component.passwordForm.get('password')?.markAsTouched();
    mockDatabaseService.updatePassword.mockResolvedValue(undefined);

    await component.onPasswordSave();

    expect(mockDatabaseService.updatePassword).not.toHaveBeenCalled();
  });
});
