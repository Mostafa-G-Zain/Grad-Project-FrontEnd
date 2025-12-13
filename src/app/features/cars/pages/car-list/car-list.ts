import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarService } from '../../../../core/services/car.service';
import {
  ICar,
  IMake,
  IModel,
  IBodyType,
  IFuelType,
  ILocation,
  CarCondition,
  CarGearType
} from '../../../../shared/models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss'
})
export class CarListComponent implements OnInit {
  private carService = inject(CarService);
  private fb = inject(FormBuilder);

  // Expose enums
  CarCondition = CarCondition;
  CarGearType = CarGearType;

  // --- Signals ---
  cars = signal<ICar[]>([]);
  makes = signal<IMake[]>([]);
  models = signal<IModel[]>([]);
  bodyTypes = signal<IBodyType[]>([]);
  fuelTypes = signal<IFuelType[]>([]);
  locations = signal<ILocation[]>([]);
  priceRange = signal<{ min: number; max: number }>({ min: 1000, max: 20000000 });
  loading = signal<boolean>(false);

  // pagination state
  pageNumber = signal<number>(1);
  pageSize = signal<number>(9);
  totalPages = signal<number>(1);
  totalRecords = signal<number>(0);

  // --- Filter Form ---
  filterForm = this.fb.group({
    search: [''],
    makeId: [''],
    modelId: [''],
    bodyTypeId: [''],
    fuelId: [''],
    locId: [''],
    minPrice: [''],
    maxPrice: [''],
    year: [''],
    condition: [null],
    gearType: [null]
  });

  ngOnInit() {
    this.loadLookup();
    this.loadPage(1);
  }

  loadLookup() {
    this.carService.getMakes().subscribe(res => this.makes.set(res));
    this.carService.getBodyTypes().subscribe(res => this.bodyTypes.set(res));
    this.carService.getFuelTypes().subscribe(res => this.fuelTypes.set(res));
    this.carService.getLocations().subscribe(res => this.locations.set(res));
  }


  loadPage(page: number) {
    if (page > 1) return;
    this.loading.set(true);

    const raw = this.filterForm.getRawValue();
    const filters: any = { ...raw };

    if (filters.makeId) filters.makeId = Number(filters.makeId);
    if (filters.modelId) filters.modelId = Number(filters.modelId);
    if (filters.fuelId) filters.fuelId = Number(filters.fuelId);
    if (filters.bodyTypeId) filters.bodyTypeId = Number(filters.bodyTypeId);
    if (filters.locId) filters.locId = Number(filters.locId);
    if (filters.minPrice) filters.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) filters.maxPrice = Number(filters.maxPrice);
    if (filters.year) filters.year = Number(filters.year);

    if (filters.condition !== null && filters.condition !== '') filters.condition = Number(filters.condition);
    if (filters.gearType !== null && filters.gearType !== '') filters.gearType = Number(filters.gearType);

    this.carService.getCars(filters, page, this.pageSize()).subscribe({
      next: res => {
        this.cars.set(res.data);
        this.pageNumber.set(res.pageNumber);
        this.totalPages.set(res.totalPages);
        this.totalRecords.set(res.totalRecords);
        this.loading.set(false);
      },
      error: err => {
        console.log(err);
        this.loading.set(false);
      }
    });
  }

  onMakeChange() {
    const selectedMakeId = this.filterForm.get('makeId')?.value;
    this.filterForm.patchValue({ modelId: '' });
    this.models.set([]);

    if (selectedMakeId) {
      this.carService.getModelsByMake(Number(selectedMakeId)).subscribe(res => {
        this.models.set(res);
      });
    }
  }


  applyFilters() {
    this.pageNumber.set(1);
    this.loadPage(1);
  }


  resetFilters() {
    this.filterForm.reset();
    this.models.set([]);
    this.applyFilters();
  }

  canGoPrevious(): boolean {
    return this.pageNumber() > 1;
  }

  canGoNext(): boolean {
    return this.pageNumber() < this.totalPages();
  }

}
