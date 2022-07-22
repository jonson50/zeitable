import { IProject } from "./project";

export interface ITimeEntry {
   objectId: string;
   startTime: Date;
   endTime: Date;
   pauseTime: number;
   homeOffice: boolean;
   project: IProject;
   comments: string;
   totalTime: number;
}

export interface IDayRecord {
   date: Date;
   description: string;
   should: number;
   is: number;
   active: boolean;
   records: ITimeEntry[];
   opened: boolean;
}