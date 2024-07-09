import { Branch } from "./branches";

export interface ClientUserRequest {
  clientUserRequestId: number;
  name: string;
  surname: string;
  number: string;
  email: string;
  role: string;
  branch: Branch;
  clientUserPosition: string;
  userCreated: boolean;
}
