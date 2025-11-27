import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { ICar, ICarFilters } from '../../shared/models/car.model';
import { formatCurrency } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/cars';

  getCars(filters?: ICarFilters): Observable<ICar[]> {
    let params = new HttpParams();

    if(filters) {
      if (filters.makeId) params = params.set('makeId', filters.makeId);
      if (filters.modelId) params = params.set('modelId', filters.modelId);
      if (filters.bodyTypeId) params = params.set('bodyTypeId', filters.bodyTypeId);
      if (filters.fuelId) params = params.set('fuelId', filters.fuelId);
      if (filters.locId) params = params.set('locId', filters.locId);
      if (filters.year) params = params.set('year', filters.year);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice);
    }

    return this.http.get<ICar[]>(this.apiUrl, { params });
  }


  getCarById(id: string): Observable<ICar> {
    return this.http.get<ICar>(`${this.apiUrl}/${id}`);
  }


  createCar(car: Partial<ICar>): Observable<ICar> {
    return this.http.post<ICar>(this.apiUrl, car);
  }

  updateCar(id: string, car: Partial<ICar>): Observable<ICar> {
    return this.http.put<ICar>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadCarImage(carId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post(`${this.apiUrl}/${carId}/images`, formData);
  }
}
