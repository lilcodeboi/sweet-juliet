import { Component, inject } from '@angular/core';

import { RouterOutlet, Router } from '@angular/router';

import { CommonModule } from '@angular/common';

import { Taskbar } from './taskbar/taskbar';

import { AuthService } from '../services/auth.service';



@Component({

  selector: 'app-root',

  imports: [RouterOutlet, Taskbar, CommonModule],

  templateUrl: './app.html',

  styleUrl: './app.css'

})

export class App {

  authService = inject(AuthService);
  router = inject(Router);

}

