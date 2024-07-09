import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquarecheckoutComponent } from './squarecheckout.component';

describe('SquarecheckoutComponent', () => {
  let component: SquarecheckoutComponent;
  let fixture: ComponentFixture<SquarecheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquarecheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquarecheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
