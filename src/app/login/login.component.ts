import { Component, OnInit } from '@angular/core';
import { LoginService } from '../servicios/login/login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { isArray } from 'util';
import { LoginModel } from '../modelos/login/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  usuario = "";
  password = "";
  constructor(private LogS: LoginService, private router: Router) {
    if (localStorage.getItem('isLoggedIn')=='true'){ this.router.navigate(['/sys/facturacion']);}
   }

  ngOnInit() {

  }

  VerificarUsuario(){
    Swal.fire({
      title: '<strong style="font-size:medium;">VERIFICANDO CREDENCIALES</strong>',
      html: `<div class="spinner-border text-primary" style="style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
            </div>`,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false      
    });
    this.LogS.VerificarUsuario(this.usuario, this.password).subscribe(
      (Data: LoginModel[]) => {
        let id, tipo;
        for (let item of Data){
          id = item.ID;
          tipo = item.idTipo;
        }
        if (Data.length==1){
          Swal.close();
          localStorage.setItem('isLoggedIn','true');
          localStorage.setItem('token', id);
          localStorage.setItem('isAdmin', tipo);
          this.router.navigate(['/sys/facturacion']);
        }else{
          Swal.fire({
            type: 'error',
            title: 'CREDENCIALES',
            text: 'USUARIO Y/O CONTRASEÑA INCORRECTOS.'
          });
        }
      },
      (err) => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Hubo problemas al verificar el usuario'
        });
      }
    );
  }

}
