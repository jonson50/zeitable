export interface IProject {
   id: string;
   projectParent: IProject | null;
   code: string;
   name: string;
   active: boolean;
}