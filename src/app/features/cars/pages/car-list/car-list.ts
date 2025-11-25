import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { Car } from '../../../../shared/models/car.model';

@Component({
  selector: 'app-car-list',
  imports: [CommonModule],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarListComponent {
  cars: Car[] = [
    {
      id: "1",
      title: "Toyota Camry",
      brand: "Toyota",
      model: "Camry",
      year: 2022,
      price: 25000,
      images: [],
      mileage: 10000,
      color: 'Black',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      condition: 'New',
      description: 'This is a brand new Toyota Camry.',
      createdAt: new Date(),
      sellerId: '1'
    },
    {
      id: "2",
      title: "Honda Civic",
      brand: "Honda",
      model: "Civic",
      year: 2022,
      price: 25000,
      images: [],
      mileage: 10000,
      color: 'Black',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      condition: 'New',
      description: 'This is a brand new Honda Civic.',
      createdAt: new Date(),
      sellerId: '1'
    }
  ]
}
