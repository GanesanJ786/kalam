import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentAttendanceRangeComponent } from './view-student-attendance-range.component';

describe('ViewStudentAttendanceRangeComponent', () => {
  let component: ViewStudentAttendanceRangeComponent;
  let fixture: ComponentFixture<ViewStudentAttendanceRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentAttendanceRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentAttendanceRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
