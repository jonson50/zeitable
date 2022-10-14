import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HollidaySettingComponent } from './holliday-setting.component';

describe('HollidaySettingComponent', () => {
  let component: HollidaySettingComponent;
  let fixture: ComponentFixture<HollidaySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HollidaySettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HollidaySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
