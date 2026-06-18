export interface User {
  user_id: number;
  username: string;
  password: string;
  salt: string;
  first_name: string;
  last_name: string;
  email_addr: string;
}