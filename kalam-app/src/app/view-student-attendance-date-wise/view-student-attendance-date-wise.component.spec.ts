import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentAttendanceDateWiseComponent } from './view-student-attendance-date-wise.component';

describe('ViewStudentAttendanceDateWiseComponent', () => {
  let component: ViewStudentAttendanceDateWiseComponent;
  let fixture: ComponentFixture<ViewStudentAttendanceDateWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentAttendanceDateWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentAttendanceDateWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
