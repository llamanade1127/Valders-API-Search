import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChromebookSearchComponent } from './chromebook-search/chromebook-search.component';
import {SettingsPageComponent} from "./settings-page/settings-page.component";
import {StudentTableComponent} from "./student-table/student-table.component";

const routes: Routes = [
  { path: '', component: ChromebookSearchComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'table', component: StudentTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
