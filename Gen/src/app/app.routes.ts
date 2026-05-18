import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { IssueListComponent } from './issue-list-component/issue-list-component';
import { CreateIssueComponent } from './comp/create-issue-component/create-issue-component';
import { Admindashbord } from './comp/admindashbord/admindashbord';
import { Reports } from './comp/reports/reports';
import { Usermanage } from './usermanage/usermanage';
import { Chatcomp } from './comp/chatcomp/chatcomp';
 

export const routes: Routes = [

  // Default route → redirect to login or dashboard
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {path: 'issue',component:IssueListComponent},
  {path:'create',component:CreateIssueComponent},
  {path:'admin',component:Admindashbord},
  {path:'report',component:Reports},
  {path:'usermanage',component:Usermanage},
  {path:'chat',component:Chatcomp},
  { path: '**', redirectTo: 'login' }
];
