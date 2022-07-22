import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRecordCardComponent } from './time-record-card.component';

describe('TimeRecordCardComponent', () => {
  let component: TimeRecordCardComponent;
  let fixture: ComponentFixture<TimeRecordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeRecordCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRecordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
