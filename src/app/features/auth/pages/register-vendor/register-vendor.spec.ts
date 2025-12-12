import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVendor } from './register-vendor';

describe('RegisterVendor', () => {
  let component: RegisterVendor;
  let fixture: ComponentFixture<RegisterVendor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterVendor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterVendor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
