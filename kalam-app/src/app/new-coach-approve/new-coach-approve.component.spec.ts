import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCoachApproveComponent } from './new-coach-approve.component';

describe('NewCoachApproveComponent', () => {
  let component: NewCoachApproveComponent;
  let fixture: ComponentFixture<NewCoachApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCoachApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCoachApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
