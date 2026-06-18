import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-taskbar',
  imports: [],
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.css',
})
export class Taskbar {
  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private authService: AuthService
  ) {}

  open(content: any) {
    this.offcanvasService.open(content, { position: 'start' });
  }

  onNavigate(view: string) {
    if (view === 'login') {
      this.authService.logout();
    }
    this.router.navigate([view]);
  }
}
