import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromebookSearchComponent } from './chromebook-search.component';

describe('ChromebookSearchComponent', () => {
  let component: ChromebookSearchComponent;
  let fixture: ComponentFixture<ChromebookSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChromebookSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChromebookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
