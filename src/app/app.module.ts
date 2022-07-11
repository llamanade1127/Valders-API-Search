import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChromebookSearchComponent } from './chromebook-search/chromebook-search.component';
import { ChromebookDataComponent } from './chromebook-data/chromebook-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { StudentDataComponent } from './student-data/student-data.component';
import { UserDataComponent } from './user-data/user-data.component';
import { ShellComponent } from './shell/shell.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { SettingsPageComponent } from './settings-page/settings-page.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ClipboardModule} from "@angular/cdk/clipboard";
import { StudentTableComponent } from './student-table/student-table.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    ChromebookSearchComponent,
    ChromebookDataComponent,
    StudentDataComponent,
    UserDataComponent,
    ShellComponent,
    SettingsPageComponent,
    StudentTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSnackBarModule,
    ClipboardModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
