export interface IProject {
   id: string;
   attributes: {
      projectParent: IProject | null;
      code: string;
      name: string;
      active: boolean;
   };
}

export class Project {
   id: string | null;
   projectParent: Project | null;
   code: string | null;
   name: string | null;
   active: boolean;

   constructor(iproject?: IProject) {
      this.id = iproject && iproject.id || null;
      this.projectParent = (iproject && iproject.attributes.projectParent)? new Project(iproject.attributes.projectParent) : null;
      this.code = iproject && iproject.attributes && iproject.attributes.code || null;
      this.name = iproject && iproject.attributes.name || null;
      this.active = iproject && iproject.attributes.active || false;
   }
}