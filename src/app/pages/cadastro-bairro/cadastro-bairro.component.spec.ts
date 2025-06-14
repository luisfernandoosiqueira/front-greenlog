import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroBairroComponent } from './cadastro-bairro.component';

describe('CadastroBairroComponent', () => {
  let component: CadastroBairroComponent;
  let fixture: ComponentFixture<CadastroBairroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroBairroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroBairroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
