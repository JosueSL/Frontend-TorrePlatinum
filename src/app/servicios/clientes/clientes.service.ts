import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  server: string = 'localhost:3000';
  //server: string = '192.168.0.180:3002';

  constructor(private http: HttpClient) { }
  
  ClienteTorre(): Observable<any>{
    return forkJoin(
      this.http.get('http://'+this.server+'/api/Sources'),
      this.http.get('http://'+this.server+'/api/MedidorTorres'),
      this.http.get('http://'+this.server+'/api/Consumos'),
      this.http.get('http://'+this.server+'/api/kWhs'),
      this.http.get('http://'+this.server+'/api/MedidorClientes')
    );
  }

}
