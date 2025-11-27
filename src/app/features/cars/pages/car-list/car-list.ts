import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICar } from '../../../../shared/models/car.model';

@Component({
  selector: 'app-car-list',
  imports: [CommonModule],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarListComponent {
  cars: ICar[] = [
    {
      carId: "1",
      get title() { return `${this.year} ${this.make?.name} ${this.model?.name}`; },
      year: 2022,
      price: 25000,
      description: 'Toyota Camry 2022',
      createdDate: new Date().toISOString(),
      makeId: 1,
      modelId: 1,
      bodyTypeId: 1,
      fuelId: 1,
      locId: 1,
      make: { id: 1, name: "Toyota" },
      model: { id: 1, name: "Camry", makeId: "1" },
      fuelType: { id: 1, name: "Petrol" },
      locationCity: { id: 1, name: "Cairo" },
      bodyType: { id: 1, name: "Sedan" },
      carImages: []
    },
    {
      carId: "2",
      get title() { return `${this.year} ${this.make?.name} ${this.model?.name}`; },
      year: 2023,
      price: 23000,
      description: 'Honda Civic 2023',
      createdDate: new Date().toISOString(),
      makeId: 2,
      modelId: 2,
      bodyTypeId: 1,
      fuelId: 1,
      locId: 1,
      make: { id: 2, name: "Honda" },
      model: { id: 2, name: "Civic", makeId: "2" },
      fuelType: { id: 1, name: "Petrol" },
      locationCity: { id: 1, name: "Cairo" },
      bodyType: { id: 1, name: "Sedan" },
      carImages: []
    },
    {
      carId: "3",
      get title() { return `${this.year} ${this.make?.name} ${this.model?.name}`; },
      year: 2021,
      price: 45000,
      description: 'Ford F-150 2021',
      createdDate: new Date().toISOString(),
      makeId: 3,
      modelId: 3,
      bodyTypeId: 2,
      fuelId: 2,
      locId: 1,
      make: { id: 3, name: "Ford" },
      model: { id: 3, name: "F-150", makeId: "3" },
      fuelType: { id: 2, name: "Diesel" },
      locationCity: { id: 1, name: "Cairo" },
      bodyType: { id: 2, name: "Truck" },
      carImages: []
    },
    {
      carId: "4",
      get title() { return `${this.year} ${this.make?.name} ${this.model?.name}`; },
      year: 2024,
      price: 40000,
      description: 'Tesla Model 3 2024',
      createdDate: new Date().toISOString(),
      makeId: 4,
      modelId: 4,
      bodyTypeId: 1,
      fuelId: 3,
      locId: 1,
      make: { id: 4, name: "Tesla" },
      model: { id: 4, name: "Model 3", makeId: "4" },
      fuelType: { id: 3, name: "Electric" },
      locationCity: { id: 1, name: "Cairo" },
      bodyType: { id: 1, name: "Sedan" },
      carImages: []
    },
  ]
}