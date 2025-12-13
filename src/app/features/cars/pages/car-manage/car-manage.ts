import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-car-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './car-manage.html',
  styleUrl: './car-manage.scss'
})
export class CarManageComponent implements OnInit {
  private carService = inject(CarService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // lookups
  makes = signal<IMake[]>([]);
  models = signal<IModel[]>([]);
  bodyTypes = signal<IBodyType[]>([]);
  fuelTypes = signal<IFuelType[]>([]);
  locations = signal<ILocation[]>([]);

  // Enums for template
  CarCondition = CarCondition;
  CarGearType = CarGearType;

  carForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  currentCarId: string | null = null;

  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentCarId = id;
      this.loadCar(id);
    }
  }

  private initForm() {
    this.carForm = this.fb.group({
      Year: [null, Validators.required],
      Price: [null, Validators.required],

      Condition: [null, Validators.required],
      Mileage: [null, [Validators.required, Validators.min(0)]],
      LastInspectionDate: [null, Validators.required],
      GearType: [null, Validators.required],

      MakeId: [null, Validators.required],
      ModelId: [null, Validators.required],
      BodyTypeId: [null, Validators.required],
      FuelId: [null, Validators.required],
      LocId: [null, Validators.required],
      Description: ['', Validators.required],
      images: [null]
    });
  }

  private loadLookups() {
    this.carService.getMakes().subscribe(res => this.makes.set(res));
    this.carService.getBodyTypes().subscribe(res => this.bodyTypes.set(res));
    this.carService.getFuelTypes().subscribe(res => this.fuelTypes.set(res));
    this.carService.getLocations().subscribe(res => this.locations.set(res));
  }

  private loadCar(id: string) {
    this.carService.getCarById(id).subscribe(res => {
      // Format date to YYYY-MM-DD for input[type=date]
      const inspectionDate = res.lastInspectionDate
        ? new Date(res.lastInspectionDate).toISOString().split('T')[0]
        : null;

      this.carForm.patchValue({
        Year: res.year,
        Price: res.price,

        Condition: res.condition,
        Mileage: res.mileage,
        LastInspectionDate: inspectionDate,
        GearType: res.gearType,

        MakeId: res.makeId,
        ModelId: res.modelId,
        BodyTypeId: res.bodyTypeId,
        FuelId: res.fuelId,
        LocId: res.locId,
        Description: res.description
      });

      this.uploadedFiles = [];
      if (res.imageUrls && res.imageUrls.length > 0) {
        res.imageUrls.forEach(imgUrl => {
          const fileName = imgUrl.split('/').pop();
          this.uploadedFiles.push({
            file: null,
            name: fileName,
            originalName: fileName,
            previewUrl: 'https://carnest.runasp.net/' + imgUrl,
            isOld: true,
            progress: 100
          });
        });
      }
      this.updateFormImages();

      // Load models for the selected make
      if (res.makeId) {
        this.carService.getModelsByMake(res.makeId).subscribe(models => this.models.set(models));
      }
    });
  }

  onMakeChange() {
    const selectedMakeId = this.carForm.get('MakeId')?.value;
    this.carForm.patchValue({ ModelId: null });
    this.models.set([]);

    if (selectedMakeId) {
      this.carService.getModelsByMake(Number(selectedMakeId)).subscribe(res => {
        this.models.set(res);
      });
    }
  }

  onSubmit() {
    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    const value = this.carForm.value;
    console.log('Form value:', value); 

    const formData = new FormData();

    formData.append('Year', String(value.Year));
    formData.append('Price', String(value.Price));

    formData.append('Condition', String(value.Condition));
    formData.append('Mileage', String(value.Mileage));
    formData.append('LastInspectionDate', String(value.LastInspectionDate));
    formData.append('GearType', String(value.GearType));

    formData.append('MakeId', String(value.MakeId));
    formData.append('ModelId', String(value.ModelId));

    if (value.BodyTypeId == null) {
      this.isLoading = false;
      alert('Please select a body type');
      return;
    }
    formData.append('BodyTypeId', String(value.BodyTypeId));

    formData.append('FuelId', String(value.FuelId));
    formData.append('LocId', String(value.LocId));
    formData.append('Description', value.Description ?? '');

    const images = this.carForm.get('images')?.value;
    if (images && images.length > 0) {
      images.forEach((img: any) => {
        formData.append('images', img);
      });
    }


    if (!this.isEditMode) {
      // create
      this.carService.createCar(formData).subscribe({
        next: (res: ICar) => {
          this.isLoading = false;
          this.router.navigate(['/cars', res.carId]);
        },
        error: err => {
          console.error('Create car error:', err);
          console.error('Error details:', err.error);
          alert('Error creating car: ' + JSON.stringify(err.error));
          this.isLoading = false;
        }
      });
    } else if (this.currentCarId) {
      // update
      this.carService.updateCar(this.currentCarId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/cars', this.currentCarId!]);
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  // ---------- files ----------
  onFileSelected(event: Event, index?: number) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const fileData = {
        file,
        name: file.name,
        originalName: file.name,
        progress: 100,
        previewUrl: reader.result as string,
        isOld: false
      };

      if (index !== undefined) {
        this.uploadedFiles[index] = fileData;
      } else {
        this.uploadedFiles.push(fileData);
      }

      this.updateFormImages();
    };

    reader.readAsDataURL(file);
  }

  updateFormImages() {
    const finalFiles: any[] = [];

    this.uploadedFiles.forEach(f => {
      if (f.file) {
        finalFiles.push(f.file);
      } else if (f.isOld) {
        finalFiles.push(f.originalName);
      }
    });

    this.carForm.get('images')?.setValue(finalFiles);
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.updateFormImages();
  }

  getFileType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!ext) return 'other';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx'].includes(ext)) return 'excel';
    return 'other';
  }
}
