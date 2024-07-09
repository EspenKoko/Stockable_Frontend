import { Branch } from "./branches";
import { Client } from "./clients";
import { User } from "./users";

export interface ClientUser {
    clientUserId: number;
    clientUserPosition: string;

    //fk
    clientId: number;
    client: Client;

    //fk
    userId: number;
    user: User;

    //fk
    branchId: number;
    branch: Branch;
}