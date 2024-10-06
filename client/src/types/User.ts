export interface User {
  username: string;
  role: string;
  approved: boolean;
  products: null | [];
  id: number;
  jwt: string;
}
