export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2,
  PreferNotToSay = 3
}

export interface Child {
  child_id: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  user_id: number;
  birthday: Date;
}