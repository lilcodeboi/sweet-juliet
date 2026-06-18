import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../models/user';
import { Child } from '../../models/child';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      childFName: ['', [Validators.required]],
      childLName: ['', [Validators.required]],
      childBirthDate: ['', [Validators.required]],
      childGender: [0, [Validators.required]]
    });
  }

  async register() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    try {
      const formValue = this.signupForm.value;
      const existingUser = await this.databaseService.getUserByUsername(formValue.username);
      if (existingUser) {
        this.errorMessage = 'Username already exists';
        return;
      }

      if (formValue.password !== formValue.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      const user: User = {
        user_id: 0,
        username: formValue.username,
        password: formValue.password,
        salt: '',
        first_name: formValue.firstName,
        last_name: formValue.lastName,
        email_addr: formValue.email
      };
      const userId = await this.databaseService.createUser(
        user
      );

      const child: Child = {
        child_id: 0,
        user_id: userId,
        first_name: formValue.childFName,
        last_name: formValue.childLName,
        gender: formValue.childGender,
        birthday: formValue.childBirthDate
      };
      await this.databaseService.createChild(
        child
      );

      this.successMessage = 'Registration successful! Redirecting to login...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      this.errorMessage = 'An error occurred during registration';
    }
  }

  login() {
    this.router.navigate(['/login']);
  }
}
