export interface HubUser {
    hubUserId: number;
    hubUserName: string;
    hubUserSurname: string;
    hubUserPhoneNumber: string;
    hubUserEmail: string;
    hubUserPosition: string;

    //fk
    userId:number;
    userName:string;
    userPassword:string;
}