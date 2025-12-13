import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarService } from '../../../../core/services/car.service';
import { ICar, CarCondition, CarGearType } from '../../../../shared/models/car.model';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './car-details.html',
  styleUrl: './car-details.css'
})
export class CarDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private carService = inject(CarService);
  private auth = inject(AuthService);

  car = signal<ICar | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedImageIndex = signal(0);

  // Expose enums to template
  CarCondition = CarCondition;
  CarGearType = CarGearType;

  get canEdit(): boolean {
    const user = this.auth.currentUser();
    return !!user && user.role === 'Vendor';
  }

  ngOnInit(): void {
    // Scroll to top on first load
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Invalid car id');
      this.loading.set(false);
      return;
    }

    this.carService.getCarById(id).subscribe({
      next: (data) => {
        this.car.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Car details error:', err);
        if (err.status === 404) {
          this.error.set('Car not found');
        } else {
          this.error.set('Failed to load car details');
        }
        this.loading.set(false);
      }
    });
  }

  nextImage(): void {
    const c = this.car();
    const images = c?.imageUrls ?? [];
    if (!images.length) return;

    this.selectedImageIndex.update(current =>
      current + 1 >= images.length ? 0 : current + 1
    );
  }

  prevImage(): void {
    const c = this.car();
    const images = c?.imageUrls ?? [];
    if (!images.length) return;

    this.selectedImageIndex.update(current =>
      current - 1 < 0 ? images.length - 1 : current - 1
    );
  }

  setImage(index: number): void {
    const c = this.car();
    const images = c?.imageUrls ?? [];
    if (!images.length) return;

    if (index >= 0 && index < images.length) {
      this.selectedImageIndex.set(index);
    }
  }


}

