import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonantesReporteComponent } from './donantes-reporte.component';

describe('DonantesReporteComponent', () => {
  let component: DonantesReporteComponent;
  let fixture: ComponentFixture<DonantesReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonantesReporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonantesReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
