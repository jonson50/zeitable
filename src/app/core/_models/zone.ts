import * as Parse from 'parse';

export class Zone {
  name:string;
  private _originalParseObject!: Parse.Object | undefined;

  constructor(){
    this.name = "";
  }

  get originalParseObject(): Parse.Object | undefined {
    return this._originalParseObject;
  }

  toParsePlatform(): Object {
    return {
      name: this.name
    }
  }

  patchParseValue(setting: Parse.Object): void {
    this.name = setting.attributes['name'];
  }
}