import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoachAttendanceComponent } from './view-coach-attendance.component';

describe('ViewCoachAttendanceComponent', () => {
  let component: ViewCoachAttendanceComponent;
  let fixture: ComponentFixture<ViewCoachAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCoachAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCoachAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
