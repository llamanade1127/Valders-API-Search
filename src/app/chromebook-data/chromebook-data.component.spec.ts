import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromebookDataComponent } from './chromebook-data.component';

describe('ChromebookDataComponent', () => {
  let component: ChromebookDataComponent;
  let fixture: ComponentFixture<ChromebookDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChromebookDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChromebookDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
