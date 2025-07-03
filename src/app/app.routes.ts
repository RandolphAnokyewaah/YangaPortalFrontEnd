import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MachinesComponent } from './pages/machines/machines.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { MembersComponent } from './pages/members/members.component';
import { PromotionsComponent } from './pages/promotions/promotions.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'members', component: MembersComponent },
      { path: 'promotions', component: PromotionsComponent },
      { path: 'machines', component: MachinesComponent },
      {path: 'users',component: UsersComponent
}

    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/' },
];