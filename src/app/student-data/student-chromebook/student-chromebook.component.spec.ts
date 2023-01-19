import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChromebookComponent } from './student-chromebook.component';

describe('StudentChromebookComponent', () => {
  let component: StudentChromebookComponent;
  let fixture: ComponentFixture<StudentChromebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentChromebookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentChromebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
