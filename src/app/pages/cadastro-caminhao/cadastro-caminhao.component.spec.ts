import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCaminhaoComponent } from './cadastro-caminhao.component';

describe('CadastroCaminhaoComponent', () => {
  let component: CadastroCaminhaoComponent;
  let fixture: ComponentFixture<CadastroCaminhaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCaminhaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroCaminhaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
