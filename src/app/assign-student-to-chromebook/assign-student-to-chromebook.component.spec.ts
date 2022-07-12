import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignStudentToChromebookComponent } from './assign-student-to-chromebook.component';

describe('AssignStudentToChromebookComponent', () => {
  let component: AssignStudentToChromebookComponent;
  let fixture: ComponentFixture<AssignStudentToChromebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignStudentToChromebookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignStudentToChromebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
