import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICar, CarFilter, IMake, IModel, IBodyType, IFuelType, ILocation, IPagedResponse } from '../../shared/models/car.model';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private http = inject(HttpClient);
  private apiUrl = 'https://carnest.runasp.net/api/Car';
  private baseUrl = 'https://carnest.runasp.net/api';

  getCars(filters: CarFilter, pageNumber = 1, pageSize = 9): Observable<IPagedResponse<ICar>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    // Dropdowns for Ids
    if (filters.makeId) params = params.set('makeId', filters.makeId);
    if (filters.modelId) params = params.set('modelId', filters.modelId);
    if (filters.bodyTypeId) params = params.set('bodyTypeId', filters.bodyTypeId);
    if (filters.fuelId) params = params.set('fuelId', filters.fuelId);
    if (filters.locId) params = params.set('locId', filters.locId);

    // Ranges
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice);
    if (filters.year) params = params.set('year', filters.year);

    // New filters
    if (filters.condition !== undefined && filters.condition !== null) params = params.set('condition', filters.condition);
    if (filters.gearType !== undefined && filters.gearType !== null) params = params.set('gearType', filters.gearType);

    return this.http.get<IPagedResponse<ICar>>(`${this.baseUrl}/Car`, { params });


  }
  getCarById(id: string): Observable<ICar> {
    return this.http.get<ICar>(`${this.baseUrl}/Car/${id}`);
  }

  getVendorCars(): Observable<ICar[]> {
    return this.http.get<ICar[]>(`${this.baseUrl}/Car/vendor/cars`);
  }

  getMakes(): Observable<IMake[]> {
    return this.http.get<IMake[]>(`${this.baseUrl}/Make`);
  }

  getModelsByMake(makeId: number): Observable<IModel[]> {
    return this.http.get<IModel[]>(`${this.baseUrl}/Model`, {
      params: new HttpParams().set('makeId', makeId),
    });
  }

  getBodyTypes(): Observable<IBodyType[]> {
    return this.http.get<any[]>(`${this.baseUrl}/BodyType`).pipe(
      map(bodyTypes => bodyTypes.map(bt => ({
        bodyTypeId: bt.bodyId,
        name: bt.name
      })))
    );
  }

  getFuelTypes(): Observable<IFuelType[]> {
    return this.http.get<IFuelType[]>(`${this.baseUrl}/FuelType`);
  }

  getLocations(): Observable<ILocation[]> {
    return this.http.get<ILocation[]>(`${this.baseUrl}/LocationCity`);
  }

  // admin and vendor CRUD
  createCar(car: FormData): Observable<ICar> {
    return this.http.post<ICar>(`${this.baseUrl}/Car`, car);
  }

  updateCar(id: string, car: FormData): Observable<ICar> {
    return this.http.put<ICar>(`${this.baseUrl}/Car/${id}`, car);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Car/${id}`);
  }

  uploadCarImage(carId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post(`${this.baseUrl}/Car/${carId}/images`, formData);
  }
}

