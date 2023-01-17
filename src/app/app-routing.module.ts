import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChromebookSearchComponent } from './chromebook-search/chromebook-search.component';
import {SettingsPageComponent} from "./settings-page/settings-page.component";
import {StudentTableComponent} from "./student-table/student-table.component";
import {StudentDataComponent} from "./student-data/student-data.component";
import {ChromebookDataComponent} from "./chromebook-data/chromebook-data.component";
import {UserDataComponent} from "./user-data/user-data.component";
import {LinkStudentDataFormComponent} from "./link-student-data-form/link-student-data-form.component";
import {AssignStudentToChromebookComponent} from "./assign-student-to-chromebook/assign-student-to-chromebook.component";
import {AssignUserToChromebookComponent} from "./assign-user-to-chromebook/assign-user-to-chromebook.component";
import {CreateStudentComponent} from "./create-student/create-student.component";
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import {TicketComponent} from "./Templates/ticket/ticket.component";
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: ChromebookSearchComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'settings/linkReturnData', component: LinkStudentDataFormComponent},
  { path: 'table', component: StudentTableComponent},
  { path: 'student/:id', component: StudentDataComponent},
  { path: 'chromebook/:id', component:ChromebookDataComponent},
  { path: 'user/:id', component: UserDataComponent},
  { path: 'chromebook/:id/addStudent', component: AssignStudentToChromebookComponent},
  { path: 'chromebook/:id/tickets/active/:ticketID', component: TicketComponent},
  { path: 'chromebook/:id/tickets/completed/:ticketID', component: TicketComponent},
  { path: 'user/:id/assignChromebook', component: AssignUserToChromebookComponent},
  { path: 'create/student', component: CreateStudentComponent},
  { path: 'create/ticket', component: CreateTicketComponent},
  { path: "test", component: TicketComponent},
  { path: "home", component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
