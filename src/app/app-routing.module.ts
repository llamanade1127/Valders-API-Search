import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChromebookSearchComponent } from './chromebook-search/chromebook-search.component';

const routes: Routes = [
  { path: '', component: ChromebookSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
