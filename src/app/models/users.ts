//technically viewmodels

export interface User {
    id: number;
    email: string;
    userFirstName: string;
    userLastName: string;
    userType: string;
    phoneNumber: string;
    password: string;
    role: string;
    profilePicture?: string;
}

export interface LoginUser {
    emailaddress: string;
    password: string;
}

export interface UpdateUser {
    id: string;
    userFirstName: string;
    userLastName: string;
    userType: string;
    email: string;
    phoneNumber: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    role: string;
    profilePicture?: string;
}

export interface forgetPassword {
    email: string;
}

export interface resetPassword {
    userId: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface confirmEmail {
    userId: string;
    token: string;
}