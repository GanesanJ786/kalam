import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StudentFormComponent } from './student-form/student-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'student-form', component: StudentFormComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
