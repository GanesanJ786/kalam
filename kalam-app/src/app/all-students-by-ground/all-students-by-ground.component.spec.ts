import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStudentsByGroundComponent } from './all-students-by-ground.component';

describe('AllStudentsByGroundComponent', () => {
  let component: AllStudentsByGroundComponent;
  let fixture: ComponentFixture<AllStudentsByGroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllStudentsByGroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllStudentsByGroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
