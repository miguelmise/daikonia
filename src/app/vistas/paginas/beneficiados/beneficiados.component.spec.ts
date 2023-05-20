import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiadosComponent } from './beneficiados.component';

describe('BeneficiadosComponent', () => {
  let component: BeneficiadosComponent;
  let fixture: ComponentFixture<BeneficiadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
