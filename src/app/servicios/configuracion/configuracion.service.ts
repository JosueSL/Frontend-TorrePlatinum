import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  server: string = 'localhost:3000';
  //server: string = '192.168.0.180:3002';

  constructor(private http: HttpClient) { }

  ObtenerDatos(): Observable<any>{
    return forkJoin(
      this.http.get('http://'+this.server+'/api/MedidorClientes'),
      this.http.get('http://'+this.server+'/api/Consumos'),
      this.http.get('http://'+this.server+'/api/kWhs'),
      this.http.get('http://'+this.server+'/api/Sources'),
      this.http.get('http://'+this.server+'/api/MedidorTorres')
    );
  }

  ActualizarConsumo(id, body){
    return this.http.patch('http://'+this.server+'/api/Consumos/'+id, body);
  }

  ActualizarkWh(id, body){
    return this.http.patch('http://'+this.server+'/api/kWhs/'+id, body);
  }

  AddMedidorCliente(body){
    return this.http.post('http://'+this.server+'/api/MedidorClientes', body);
  }

  UpdateMedidorCliente(id, body){
    return this.http.patch('http://'+this.server+'/api/MedidorClientes/'+id, body);
  }
}
