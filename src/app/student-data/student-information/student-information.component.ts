import {Component, Input} from '@angular/core';
import {ApiService, Student, UserPhoto} from "../../api.service";
import {provideHttpClient} from "@angular/common/http";

@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.scss']
})
export class StudentInformationComponent {

  //@ts-ignore
  @Input() student: Student;

  photo!: UserPhoto
  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.GetUserPhoto(this.student.PrimaryEmail).subscribe((photo) => {
      // @ts-ignore
      photo.photo.photoData = this.convertPhotoUrl(photo.photo.photoData);
      this.photo = photo.photo;
    })
  }

  convertPhotoUrl(input: String) {
    // Replace non-url compatible chars with base64 standard chars
    input = input
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4;
    if(pad) {
      if(pad === 1) {
        throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      input += new Array(5-pad).join('=');
    }

    return input;

  }
}
