import { Routes } from '@angular/router';
import { CarListComponent } from './features/cars/pages/car-list/car-list';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cars',
        pathMatch: 'full'
    },
    {
        path: 'cars',
        component: CarListComponent,
    },
    {
        path: '**',
        redirectTo: 'cars',
    }


];
