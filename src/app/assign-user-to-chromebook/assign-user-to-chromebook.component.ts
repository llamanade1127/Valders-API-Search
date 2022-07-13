import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService, Chromebook, Student, User} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {SnackBarService} from "../snack-bar.service";
import {map, Observable, of, startWith} from "rxjs";

@Component({
  selector: 'app-assign-user-to-chromebook',
  templateUrl: './assign-user-to-chromebook.component.html',
  styleUrls: ['./assign-user-to-chromebook.component.scss']
})
export class AssignUserToChromebookComponent implements OnInit {
  //@ts-ignore
  form: FormGroup;

  //@ts-ignore
  student: Student;

  //@ts-ignore
  user: User;

  //@ts-ignore
  chromebook: Chromebook

  //@ts-ignore
  chromebookOptions: Observable<string[]>
  //@ts-ignore
  allOptions: string[] = [""]
  loading = true;



  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private snack:SnackBarService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.api.QueryUser(params['id'], 'id').subscribe({
        next: value => {
          this.user = value.data;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.snack.error("Error loading data")
        }
      })
    })

    // this.GetAllChromebookFilter()
    //
    // this.api.GetAllChromebooks().subscribe({
    //   next: value => {
    //     console.log(value)
    //     let values = value.chromebooks.flatMap((chromebook) => {
    //       return [chromebook.serialNumber, chromebook.annotatedAssetId]
    //     }).filter((item) => item)
    //     this.allOptions = values;
    //   }
    // })

    this.form = this.fb.group({
      id: ['', [Validators.required]],
    })

    // this.chromebookOptions = this.form.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value['id'] || '')),
    // );
  }

  OnSubmit(){
    this.loading = true;
    let id = this.form.get('id')?.value;
    let type = this.form.get('type')?.value;
    this.api.QueryChromebook(type, id).subscribe({
      next: data => {
        this.chromebook = data.chromebook;

        //Check if their is student
        this.api.QueryStudent(this.chromebook.serialNumber).subscribe({
          next: student => {
            this.student = student.student;
            this.loading = false;
          }, error: err => {
            //@ts-ignore
            this.student = null;
            this.loading = false;
          }
        })
      },
      error: err => {
        this.snack.error(err.error())
        this.loading = false;
      }
    })
  }

  /**
   * All possible options for assigning student
   * @constructor
   */

  CreateStudent(){

  }

  ReAssignChromebook(){
    //Remove chromebook from active student

    //Create new student with this chromebook
  }

  // private _filter(value: string): string[] {
  //
  //   const filterValue = value.toLowerCase();
  //   return this.allOptions.filter(option => {return option.toLowerCase().includes(filterValue)});
  // }

}
