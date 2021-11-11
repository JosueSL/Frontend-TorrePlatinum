import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  server: string = 'localhost:3000';
  //server: string = '192.168.0.180:3002';

  constructor(private http: HttpClient) { }

  VerificarUsuario(user, pass){
    let url = 'http://'+this.server+'/api/Usuarios?'+
              'filter[where][usuario]='+user+'&'+
              'filter[where][contrasena]='+pass;
    return this.http.get(url);
  }
}
