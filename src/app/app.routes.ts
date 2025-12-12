import { Routes } from '@angular/router';
import { CarListComponent } from './features/cars/pages/car-list/car-list';
import { HomeComponent } from './features/home/pages/home/home';
import { CarDetailsComponent } from './features/cars/pages/car-details/car-details';
import { LoginComponent } from './features/auth/pages/login/login';
import { authGuard } from './core/guards/auth-guard';
import { RegisterCustomerComponent } from './features/auth/pages/register-customer/register-customer';
import { RegisterVendorComponent } from './features/auth/pages/register-vendor/register-vendor';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'cars',
        component: CarListComponent,
        canActivate: [authGuard]
    },

    {
        path: 'cars/:id',
        component: CarDetailsComponent

    },


    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'register-customer',
        component: RegisterCustomerComponent
    },

    {
        path: 'register-vendor',
        component: RegisterVendorComponent
    },

    {
        path: '**',
        redirectTo: ''
    }
];
