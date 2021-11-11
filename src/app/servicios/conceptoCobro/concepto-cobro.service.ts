import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConceptoCobroService {
  ListaConcepto=[];
  server: string = 'localhost:3000';
  //server: string = '192.168.0.180:3002';
  constructor(private http: HttpClient) { 
    this.ListaConcepto = [
      { id: 1, concepto: 'COSTO DE ENERGIA', valor: 0.00 },
      { id: 2, concepto: 'ALUMBRADO PÚBLICO', valor: 0.00 },
      { id: 3, concepto: 'CARGO DE COMERCIALIZACIÓN', valor: 0.00 },
      { id: 4, concepto: 'CARGO DE REGULACIÓN:', valor: 0.00 },
      { id: 5, concepto: 'CARGO POR FINANCIAMIENTO:', valor: 0.00 },
      { id: 6, concepto: 'RECTIFICACION/AJUSTE:', valor: 0.00 },
      { id: 7, concepto: 'RECARGO POR MORA', valor: 0.00 },
      { id: 8, concepto: 'OTROS CARGOS/CREDITOS', valor: 0.00 },
      { id: 9, concepto: 'CUOTA MANTENIMIENTO', valor: 0.00 }
    ];
  }

  GetDataConfig(): Observable<any>{
    return forkJoin(
      this.http.get('http://'+this.server+'/api/FechaFacturas'),
      this.http.get('http://'+this.server+'/api/ConceptoCobros')
    );
  }

  PostDataConcepto(body, id){
    return this.http.patch('http://'+this.server+'/api/ConceptoCobros/'+id, body);
  }

  PatchFecha(body){
    return this.http.patch('http://'+this.server+'/api/FechaFacturas/1', body);
  }

  PatchActivarCorreo(body){
    return this.http.patch('http://'+this.server+'/api/FechaFacturas/1', body);
  }
}
