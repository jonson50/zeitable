import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Settings } from '@app/core/models/setting';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, Observable, startWith } from 'rxjs';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  settingForm: FormGroup;
  employee = new FormControl<string | Parse.Object>('');
  options: Parse.Object[] = [];
  selectedEmployee!: Parse.Object | null;
  filteredOptions!: Observable<Parse.Object[]>;
  dailyHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  validityValues = [
    { name: '1 Week', value: 7 },
    { name: '2 Weeks', value: 14 },
    { name: '3 Weeks', value: 20 },
    { name: '4 Weeks', value: 30 },
  ];
  userSettings!: Settings;
  exceptionDayControl: any = new FormControl<Date | null>(null);
  isSettingsLoaded: boolean = false;
  isSettingError: boolean = false;
  hoursPerWeek = 0;
  zones: Parse.Object[] = [];

  constructor(
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService) {
    this.settingForm = this.formBuilder.group({
      employee: this.employee,
      workingDaysHours: this.formBuilder.group({
        monday: [""],
        tuesday: [""],
        wednesday: [""],
        thursday: [""],
        friday: [""],
        saturday: [""],
        sunday: [""]
      }),
      nightHours: this.formBuilder.group({
        from: ["", [Validators.required]],
        until: ["", [Validators.required]]
      }),
      zone: ["", [Validators.required]],
      maxCompensatory: ["", [Validators.required]],
      validityTimeEntry: ["", [Validators.required]],
      exceptionWorkingDays: [""]
    });
  }

  ngOnInit(): void {
    this.spinnerService.show();
    this.settingsService.getEmployeeUsers().subscribe({
      next: response => {
        this.options = response;
        this.filteredOptions = this.settingForm.controls['employee'].valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.attributes['name'];
            return name ? this._filter(name as string) : this.options.slice();
          }),
        );
        this.settingForm.controls['workingDaysHours'].valueChanges.subscribe(val => {
          this.hoursPerWeek = this.sumHoursInWeek(val);
        });
        this.spinnerService.hide();
      },
      error: error => {
        console.error(error.code);
      }
    })
  }

  optionSelected(_event: MatAutocompleteSelectedEvent): void {
    if (this.selectedEmployee != _event.option.value) {
      this.selectedEmployee = _event.option.value;
      console.log('Calling Employees Settings');
      this.getUserSettings(this.selectedEmployee?.get('user'));
    }
  }

  sumHoursInWeek(week: Object): number {
    let sum = 0;
    (Object.keys(week) as Array<keyof typeof week>)
      .forEach((key, index) => {
        sum += parseFloat(week[key].toString());
      });

    return sum;
  }

  closeEmployeeSearcher(_event: any): void {
    if (typeof this.settingForm.controls['employee'].value === 'string') {
      this.settingForm.controls['employee'].setValue(this.selectedEmployee);
    }
  }

  displayFn(user: Parse.Object): string {
    return user && user.attributes && user.attributes['name'] ? user.attributes['name'] : '';
  }

  private _filter(name: string): Parse.Object[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.attributes['name'].toLowerCase().includes(filterValue));
  }

  getUserSettings(user: Parse.User): void {
    this.spinnerService.show();
    this.isSettingsLoaded = false;
    this.isSettingError = false;

    this.settingsService.getZones().subscribe({
      next: zones => {
         console.log(zones)
        this.zones = zones;
        this.settingsService.getUserSettings(user).subscribe({
          next: setting => {
            if (!setting) {
              console.error('This user does not have any setting available');
              this.isSettingError = true;
              return;
            }
            this.isSettingsLoaded = true;
            this.userSettings = new Settings();
            this.userSettings.patchParseValue(setting);
            this.userSettings.exceptionWorkingDays.sort((a: Date, b: Date) => (a.getTime() - b.getTime()));
            this.userSettings.zone = this.zones.filter(value => value.id == this.userSettings.zone?.id)[0]; // Important
            this.settingForm.patchValue(this.userSettings);
            this.spinnerService.hide();
          },
          error: error => {
            console.error(error);
          },
          complete: () => {
            this.spinnerService.hide();
          }
        });
      },
      error: error => console.error(error)
    });
  }

  addExceptionalDay(): void {
    console.log(this.exceptionDayControl)
    if (this.exceptionDayControl.value) {
      const day = this.exceptionDayControl.value;
      this.userSettings.exceptionWorkingDays.push(day);
      this.userSettings.exceptionWorkingDays.sort((a: Date, b: Date) => (a.getTime() - b.getTime()));
    }
    this.exceptionDayControl.reset()
  }

  deleteExceptionDay(index: number): void {

    this.userSettings.exceptionWorkingDays.splice(index, 1);
    console.log(this.userSettings)
  }

  onSubmit(): void {
    const formValues = this.settingForm.value;
    this.userSettings.exceptionWorkingDays = formValues.exceptionWorkingDays;
    this.userSettings.maxCompensatory = formValues.maxCompensatory;
    this.userSettings.nightHours = formValues.nightHours;
    this.userSettings.validityTimeEntry = formValues.validityTimeEntry;
    this.userSettings.workingDaysHours = formValues.workingDaysHours;
    this.userSettings.zone = formValues.zone;

    this.spinnerService.show();
    if (this.userSettings.originalParseObject) {
      this.settingsService.updateSettings(this.userSettings.originalParseObject, this.userSettings.toParsePlatform())
        .subscribe({
          next: response => {
            console.log(response);
            this.spinnerService.hide();
          },
          error: error => {
            console.error(error);
            this.spinnerService.hide();
          }
        });
    }
  }
}
