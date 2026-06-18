import { Component, inject, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { User } from '../../models/user';
import { Child } from '../../models/child';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  
  if (!password || !confirmPassword) {
    return null;
  }

  if (!password.value || !confirmPassword.value || password.value === confirmPassword.value) {
    if (confirmPassword.hasError('passwordMismatch')) {
      const { passwordMismatch, ...remainingErrors } = confirmPassword.errors || {};
      confirmPassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
    }
    return null;
  }

  confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
  return { passwordMismatch: true };
};

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  fb = inject(FormBuilder);
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  userForm!: FormGroup;
  childForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });

    // 2. Attached the match validator here using the options object
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: [passwordMatchValidator]
    });

    this.childForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: [0],
      dob: ['', [Validators.required]]
    });

    this.userForm.disable();
    this.childForm.disable();
    this.passwordForm.disable();

    const userData = this.authService.getCurrentUser();
    if (userData) {
      this.userForm.patchValue({
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.username,
        email: userData.email_addr
      });
    }

    const childData = this.authService.getCurrentChild();
    if (childData) {
      this.childForm.patchValue({
        firstName: childData.first_name,
        lastName: childData.last_name,
        gender: childData.gender,
        dob: childData.birthday
      });
    }
  }

  async onUserSubmit() {
    // 3. Changed .value to .getRawValue() so disabled form values aren't lost
    const userFormValues = this.userForm.getRawValue();
    const currentUser = this.authService.getCurrentUser()!;

    const user: User = {
      user_id: currentUser.user_id,
      username: userFormValues.username,
      // Retain the current hash details during a profile name update
      password: currentUser.password, 
      salt: currentUser.salt,
      first_name: userFormValues.firstName,
      last_name: userFormValues.lastName,
      email_addr: userFormValues.email
    };
    await this.databaseService.updateUser(user);
    this.userForm.disable();
  }

  async onChildSubmit() {
    const childFormValues = this.childForm.getRawValue();
    const child: Child = {
      child_id: this.authService.getCurrentChild()!.child_id,
      user_id: this.authService.getCurrentUser()!.user_id,
      first_name: childFormValues.firstName,
      last_name: childFormValues.lastName,
      gender: childFormValues.gender,
      birthday: childFormValues.dob
    };  
    await this.databaseService.updateChild(child);
    this.childForm.disable();
  }

  async onSave() {
    if (this.userForm.invalid || this.childForm.invalid) return;
    await this.onUserSubmit();
    await this.onChildSubmit();
  }

  onUserEdit() {
    this.userForm.enable();
  }

  onChildEdit() {
    this.childForm.enable();
  }

  onPasswordEdit() {
    this.passwordForm.enable();
  }
  
  async onPasswordSave() {
    if (this.passwordForm.invalid) {
      return;
    }
    await this.onPasswordSubmit();
  }
  
  async onPasswordSubmit() {
    const passwordFormValues = this.passwordForm.getRawValue();
    const userFormValues = this.userForm.getRawValue();
    
    // Hash the password value securely
    const cryptoData = await this.authService.hashPassword(passwordFormValues.password);

    const user: User = {
      user_id: this.authService.getCurrentUser()!.user_id,
      username: userFormValues.username,
      password: cryptoData.hash, // Saves the actual hex hash generated by crypto API
      salt: cryptoData.salt,
      first_name: userFormValues.firstName,
      last_name: userFormValues.lastName,
      email_addr: userFormValues.email
    };
    await this.databaseService.updatePassword(user);
    
    // Reset and lock password fields following standard protocols
    this.passwordForm.reset({ password: '', confirmPassword: '' });
    this.passwordForm.disable();
  }
}
