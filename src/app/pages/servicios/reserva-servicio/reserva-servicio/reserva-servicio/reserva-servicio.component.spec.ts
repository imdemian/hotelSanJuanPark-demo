import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaServicioComponent } from './reserva-servicio.component';

describe('ReservaServicioComponent', () => {
  let component: ReservaServicioComponent;
  let fixture: ComponentFixture<ReservaServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
