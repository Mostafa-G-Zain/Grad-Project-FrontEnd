export interface Car{
    id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    color: string;
    fuelType: string;
    transmission: string;
    condition: string;
    images: string[];
    description: string;
    createdAt: Date;
    sellerId: string;
}
