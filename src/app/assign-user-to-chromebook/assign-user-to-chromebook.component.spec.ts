import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUserToChromebookComponent } from './assign-user-to-chromebook.component';

describe('AssignUserToChromebookComponent', () => {
  let component: AssignUserToChromebookComponent;
  let fixture: ComponentFixture<AssignUserToChromebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignUserToChromebookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignUserToChromebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
