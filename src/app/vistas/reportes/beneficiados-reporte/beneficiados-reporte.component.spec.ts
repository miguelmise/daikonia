import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiadosReporteComponent } from './beneficiados-reporte.component';

describe('BeneficiadosReporteComponent', () => {
  let component: BeneficiadosReporteComponent;
  let fixture: ComponentFixture<BeneficiadosReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiadosReporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiadosReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
