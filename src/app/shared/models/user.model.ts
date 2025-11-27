export interface IUser{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    nationalId: string;
    address: string;
    createdAt: Date;
    role: 'Admin' | 'Vendor' | "Customer";
    token: string;
}

export interface IRegisterRequest{
    firstName: string;
    lastName: string;
    email: string;
    nationalId: string;
    address: string;
    role: 'Vendor' | "Customer";
}