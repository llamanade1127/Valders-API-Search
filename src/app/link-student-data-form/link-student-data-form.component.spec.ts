import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkStudentDataFormComponent } from './link-student-data-form.component';

describe('LinkStudentDataFormComponent', () => {
  let component: LinkStudentDataFormComponent;
  let fixture: ComponentFixture<LinkStudentDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkStudentDataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkStudentDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
