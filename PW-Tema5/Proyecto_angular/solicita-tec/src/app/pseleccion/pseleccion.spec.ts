import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pseleccion } from './pseleccion';

describe('Pseleccion', () => {
  let component: Pseleccion;
  let fixture: ComponentFixture<Pseleccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pseleccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pseleccion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
