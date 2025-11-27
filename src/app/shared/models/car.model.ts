export interface IMake {
    id: number;
    name: string;
}

export interface IModel {
    id: number;
    name: string;
    makeId: string;
}


export interface IBodyType {
    id: number;
    name: string;
}


export interface IFuelType {
    id: number;
    name: string;
}


export interface ILocationCity {
    id: number;
    name: string;
}



export interface ICarImage {
    id: number;
    name: string;
    isMain: boolean;
    carId: string;
}


export interface ICar {
  carId: string; 
  title: string;
  year: number;
  price: number;
  description?: string; 
  createdDate: string;  
  makeId: number;
  modelId: number;
  bodyTypeId: number;
  fuelId: number;
  locId: number;
  adminId?: string;
  buyerId?: string; 

  make?: IMake;
  model?: IModel;
  bodyType?: IBodyType;
  fuelType?: IFuelType;
  locationCity?: ILocationCity;
  carImages?: ICarImage[];
  
}

export interface ICarFilters {
    makeId?: number;
    modelId?: number;
    year?: number;
    minPrice?: number;
    maxPrice?: number;    
    bodyTypeId?: number;
    fuelId?: number;
    locId?: number;
}
