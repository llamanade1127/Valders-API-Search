import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLoanersComponent } from './all-loaners.component';

describe('AllLoanersComponent', () => {
  let component: AllLoanersComponent;
  let fixture: ComponentFixture<AllLoanersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllLoanersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLoanersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
