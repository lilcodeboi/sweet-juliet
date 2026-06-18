import { Routes } from '@angular/router';
import { Summary } from './summary/summary';
import { Calendar } from './calendar/calendar';
import { MetricComponent } from './metric/metric';
import { Progression } from './progression/progression';
import { EventComponent } from './event/event';
import { Profile } from './profile/profile';
import { Login } from './login/login';
import { Signup } from './signup/signup';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'summary', component: Summary },
  { path: 'calendar', component: Calendar },
  { path: 'metric', component: MetricComponent },
  { path: 'progress', component: Progression },
  { path: 'event', component: EventComponent },
  { path: 'event/:id', component: EventComponent },
  { path: 'metric/:id', component: MetricComponent },
  { path: 'metric/:id/:type/:date', component: MetricComponent },
  { path: 'summary/:date', component: Summary },
  { path: 'profile', component: Profile },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
