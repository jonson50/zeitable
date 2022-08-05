import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordEntryDialogComponent } from './record-entry-dialog.component';

describe('RecordEntryDialogComponent', () => {
  let component: RecordEntryDialogComponent;
  let fixture: ComponentFixture<RecordEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordEntryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
