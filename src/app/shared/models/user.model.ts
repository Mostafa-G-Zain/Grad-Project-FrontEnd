export interface IUser{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    nationalId: string;
    address: string;
    createdDate: string; 
    role: 'Admin' | 'Vendor' | "Customer";
    token: string;
    phoneNumber?: string;
}

export interface IRegisterRequest{
    firstName: string;
    lastName: string;
    email: string;
    nationalId: string;
    address: string;
    role: 'Vendor' | "Customer";
}