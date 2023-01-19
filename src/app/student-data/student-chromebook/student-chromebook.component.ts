import {Component, Input} from '@angular/core';
import {Chromebook, Student} from "../../api.service";

@Component({
  selector: 'app-student-chromebook',
  templateUrl: './student-chromebook.component.html',
  styleUrls: ['./student-chromebook.component.scss']
})
export class StudentChromebookComponent {

  //@ts-ignore
  @Input() student: Student;

  chromebook!: Chromebook;

  ngOnInit() {
    this.chromebook = this.student.Chromebook;
  }

  round(number: number)
  {
    return Math.round(number)
  }


  convertBytes(bytes: number) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    if (bytes == 0) {
      return "n/a"
    }

    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))

    if (i == 0) {
      return bytes + " " + sizes[i]
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
  }
}
