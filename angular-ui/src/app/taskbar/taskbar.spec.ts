import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { Taskbar } from './taskbar';
import { AuthService } from '../../services/auth.service';

describe('Taskbar', () => {
  let component: Taskbar;
  let fixture: ComponentFixture<Taskbar>;
  let mockOffcanvasService: any;
  let mockRouter: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockOffcanvasService = {
      open: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockAuthService = {
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Taskbar],
      providers: [
        { provide: NgbOffcanvas, useValue: mockOffcanvasService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Taskbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open offcanvas with content', () => {
    const content = document.createElement('div');
    component.open(content);

    expect(mockOffcanvasService.open).toHaveBeenCalledWith(content, { position: 'start' });
  });

  it('should navigate to view and logout if view is login', () => {
    component.onNavigate('login');

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should navigate to view without logout if view is not login', () => {
    component.onNavigate('summary');

    expect(mockAuthService.logout).not.toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['summary']);
  });
});
