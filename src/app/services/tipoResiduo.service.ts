import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoResiduoService {
  private baseUrl = 'http://localhost:8080/tipos-residuo';

  constructor(private http: HttpClient) {}

  listarTipos(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl);
  }
}
