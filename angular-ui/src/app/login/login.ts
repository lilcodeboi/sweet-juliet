import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  async login() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    try {
      const user = await this.databaseService.getUserByUsername(this.loginForm.value.username);

      if (user && await this.authService.verifyPassword(this.loginForm.value.password, user.password, user.salt)) {
        const children = await this.databaseService.getChildrenByUserId(user.user_id);
        const child = children && children.length > 0 ? children[0] : null;

        this.authService.login(user, child);
        this.router.navigate(['/summary']);
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'An error occurred during login';
    }
  }

  register() {
    this.router.navigate(['/signup']);
  }
}
