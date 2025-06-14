// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent }               from './pages/login/login.component';
import { HomeComponent }                from './pages/home/home.component';
import { CaminhaoComponent }            from './pages/caminhao/caminhao.component';
import { MotoristaComponent }           from './pages/motorista/motorista.component';
import { BairrosComponent }             from './pages/bairros/bairros.component';
import { CadastroPontoComponent }       from './pages/cadastro-ponto/cadastro-ponto.component';
import { CadastroBairroComponent }      from './pages/cadastro-bairro/cadastro-bairro.component';
import { CadastroCaminhaoComponent }    from './pages/cadastro-caminhao/cadastro-caminhao.component';
import { CadastroMotoristaComponent }   from './pages/cadastro-motorista/cadastro-motorista.component';
import { CadastroConexaoComponent }     from './pages/cadastro-conexao/cadastro-conexao.component';
import { RotaFormComponent }            from './pages/rota-form/rota-form.component';
import { RotasListComponent }           from './pages/rotas-list/rotas-list.component';
import { ItinerarioComponent }          from './pages/itinerario/itinerario.component';
import { CadastroItinerarioComponent }  from './pages/cadastro-itinerario/cadastro-itinerario.component';

export const routes: Routes = [
  { path: '',                          component: HomeComponent },

  // rotas
  { path: 'rotas',                     component: RotasListComponent },
  { path: 'rotas/novo',                component: RotaFormComponent },
  { path: 'rotas/editar/:id',          component: RotaFormComponent },

  // autenticação
  { path: 'login',                     component: LoginComponent },

  // caminhões
  { path: 'caminhoes',                 component: CaminhaoComponent },
  { path: 'caminhoes/novo',            component: CadastroCaminhaoComponent },
  { path: 'caminhoes/editar/:placa',   component: CadastroCaminhaoComponent },

  // motoristas
  { path: 'motoristas',                component: MotoristaComponent },
  { path: 'motoristas/novo',           component: CadastroMotoristaComponent },
  { path: 'motoristas/editar/:cpf',    component: CadastroMotoristaComponent },

  // bairros e conexões
  { path: 'bairros',                   component: BairrosComponent },
  { path: 'bairros/editar/:id',        component: CadastroBairroComponent },
  { path: 'bairros/editar/:id/conexoes/nova',      component: CadastroConexaoComponent },
  { path: 'bairros/editar/:id/conexoes/:conexaoId', component: CadastroConexaoComponent },

  // pontos de coleta
  { path: 'cadastrar-ponto',           component: CadastroPontoComponent },
  { path: 'cadastrar-ponto/:id',       component: CadastroPontoComponent },

  // cadastro de bairros (rotas antigas)
  { path: 'cadastrar-bairro',          component: CadastroBairroComponent },
  { path: 'editar-bairro/:id',         component: CadastroBairroComponent },

  // itinerários (relatórios)
  { path: 'relatorios',                component: ItinerarioComponent },
  { path: 'relatorios/novo',           component: CadastroItinerarioComponent },
  { path: 'relatorios/editar/:id',     component: CadastroItinerarioComponent },
];
