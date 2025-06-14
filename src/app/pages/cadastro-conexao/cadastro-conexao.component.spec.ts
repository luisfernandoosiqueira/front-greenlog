import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroConexaoComponent } from './cadastro-conexao.component';

describe('CadastroConexaoComponent', () => {
  let component: CadastroConexaoComponent;
  let fixture: ComponentFixture<CadastroConexaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroConexaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroConexaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
