import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraExito } from './compra-exito';

describe('CompraExito', () => {
  let component: CompraExito;
  let fixture: ComponentFixture<CompraExito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraExito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraExito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
