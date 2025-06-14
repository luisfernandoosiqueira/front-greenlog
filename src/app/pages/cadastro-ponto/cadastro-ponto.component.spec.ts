import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPontoComponent } from './cadastro-ponto.component';

describe('CadastroPontoComponent', () => {
  let component: CadastroPontoComponent;
  let fixture: ComponentFixture<CadastroPontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPontoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroPontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
