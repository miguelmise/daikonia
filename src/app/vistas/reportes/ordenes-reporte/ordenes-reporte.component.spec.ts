import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesReporteComponent } from './ordenes-reporte.component';

describe('OrdenesReporteComponent', () => {
  let component: OrdenesReporteComponent;
  let fixture: ComponentFixture<OrdenesReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesReporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
