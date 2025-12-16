import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CarService } from '../../../../core/services/car.service';
import {
  ICar,
  IMake,
  IModel,
  IBodyType,
  IFuelType,
  ILocation,
  CarCondition,
  CarGearType,
  DrivetrainType
} from '../../../../shared/models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css'
})
export class CarListComponent implements OnInit, OnDestroy {
  private carService = inject(CarService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  // Expose enums
  CarCondition = CarCondition;
  CarGearType = CarGearType;
  DrivetrainType = DrivetrainType;

  // --- Signals ---
  cars = signal<ICar[]>([]);
  makes = signal<IMake[]>([]);
  models = signal<IModel[]>([]);
  bodyTypes = signal<IBodyType[]>([]);
  fuelTypes = signal<IFuelType[]>([]);
  locations = signal<ILocation[]>([]);
  priceRange = signal<{ min: number; max: number }>({ min: 10000, max: 10000000 });
  mileageRange = signal<{ min: number; max: number }>({ min: 0, max: 1000000 });
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
    minMileage: [''],
    maxMileage: [''],
    year: [''],
    condition: [null as CarCondition | null],
    gearType: [null as CarGearType | null],
    exteriorColor: ['']
  });

  ngOnInit() {
    this.loadLookup();
    this.setupDynamicSearch();

    // Read query params for initial filter
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        const type = params['type'].toLowerCase();
        if (type === 'new') {
          this.filterForm.patchValue({ condition: CarCondition.New });
        } else if (type === 'used') {
          this.filterForm.patchValue({ condition: CarCondition.Used });
        }
      }
      this.loadPage(1);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDynamicSearch() {
    // Dynamic search - triggers as you type with debounce
    this.filterForm.get('search')?.valueChanges.pipe(
      debounceTime(400),  // Wait 400ms after user stops typing
      distinctUntilChanged(),  // Only trigger if value actually changed
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadPage(1);
    });
  }

  loadLookup() {
    this.carService.getMakes().subscribe(res => this.makes.set(res));
    this.carService.getBodyTypes().subscribe(res => this.bodyTypes.set(res));
    this.carService.getFuelTypes().subscribe(res => this.fuelTypes.set(res));
    this.carService.getLocations().subscribe(res => this.locations.set(res));
  }


  loadPage(page: number) {
    if (page < 1) return;
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
    // gearType is now a number directly from [ngValue], no conversion needed
    if (filters.minMileage) filters.minMileage = Number(filters.minMileage);
    if (filters.maxMileage) filters.maxMileage = Number(filters.maxMileage);

    console.log('Search filters:', filters);

    this.carService.getCars(filters, page, this.pageSize()).subscribe({
      next: res => {
        this.cars.set(res.data);
        this.pageNumber.set(res.pageNumber);
        this.totalPages.set(res.totalPages);
        this.totalRecords.set(res.totalRecords);
        this.loading.set(false);
        // Scroll to top of results
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    this.filterForm.reset({
      search: '',
      makeId: '',
      modelId: '',
      bodyTypeId: '',
      fuelId: '',
      locId: '',
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
      year: '',
      condition: null,
      gearType: null,
      exteriorColor: ''
    });
    this.models.set([]);
    this.applyFilters();
  }

  canGoPrevious(): boolean {
    return this.pageNumber() > 1;
  }

  canGoNext(): boolean {
    return this.pageNumber() < this.totalPages();
  }

  getMinPrice(): number {
    const value = this.filterForm.get('minPrice')?.value;
    return value ? Number(value) : this.priceRange().min;
  }

  getMaxPrice(): number {
    const value = this.filterForm.get('maxPrice')?.value;
    return value ? Number(value) : this.priceRange().max;
  }

  onMinPriceChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    const maxPrice = this.getMaxPrice();

    // Ensure min doesn't exceed max
    if (value > maxPrice) {
      this.filterForm.patchValue({ minPrice: maxPrice.toString() });
    } else {
      this.filterForm.patchValue({ minPrice: value.toString() });
    }
  }

  onMaxPriceChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    const minPrice = this.getMinPrice();

    // Ensure max doesn't go below min
    if (value < minPrice) {
      this.filterForm.patchValue({ maxPrice: minPrice.toString() });
    } else {
      this.filterForm.patchValue({ maxPrice: value.toString() });
    }
  }

  // Mileage range helpers
  getMinMileage(): number {
    const value = this.filterForm.get('minMileage')?.value;
    return value ? Number(value) : this.mileageRange().min;
  }

  getMaxMileage(): number {
    const value = this.filterForm.get('maxMileage')?.value;
    return value ? Number(value) : this.mileageRange().max;
  }

  onMinMileageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    const maxMileage = this.getMaxMileage();

    // Ensure min doesn't exceed max
    if (value > maxMileage) {
      this.filterForm.patchValue({ minMileage: maxMileage.toString() });
    } else {
      this.filterForm.patchValue({ minMileage: value.toString() });
    }
  }

  onMaxMileageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    const minMileage = this.getMinMileage();

    // Ensure max doesn't go below min
    if (value < minMileage) {
      this.filterForm.patchValue({ maxMileage: minMileage.toString() });
    } else {
      this.filterForm.patchValue({ maxMileage: value.toString() });
    }
  }

}

