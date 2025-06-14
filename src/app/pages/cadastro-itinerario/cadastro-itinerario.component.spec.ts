import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroItinerarioComponent } from './cadastro-itinerario.component';

describe('CadastroItinerarioComponent', () => {
  let component: CadastroItinerarioComponent;
  let fixture: ComponentFixture<CadastroItinerarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroItinerarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroItinerarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
