import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentscholarshipComponent } from './studentscholarship.component';

describe('StudentscholarshipComponent', () => {
  let component: StudentscholarshipComponent;
  let fixture: ComponentFixture<StudentscholarshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentscholarshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentscholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
