import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumoService {

  server: string = 'localhost:3000';
  //server: string = '192.168.0.180:3002';
  
  constructor(private http: HttpClient) { }

  ConsumoCliente(SID, FechaInicial, FechaFinal, FechaInicialAnterior, ArrayFechaII, ArrayFechaIF, ArrayFechaFF, ArrayFechaFS): Observable<any> {
    let urlInicio, urlFinal;
    let urlInicio1, urlInicio2, urlInicio3, urlInicio4, urlInicio5;
    let urlFinal1, urlFinal2, urlFinal3, urlFinal4, urlFinal5;
    let urlNulos;

    urlNulos = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + FechaInicial + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + FechaFinal + " 00:00:00.0000000'&" +
      "filter[order]=TimestampUTC ASC";
    //"filter[where][Value][nlike]=null";

    //FECHA INICIO ACTUAL
    urlInicio = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + FechaInicial + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + FechaFinal + " 00:00:00.0000000'&" +
      "filter[order]=Value ASC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    //FECHA INICIO HISTORICO

    urlInicio1 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[0] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[0] + " 00:00:00.0000000'&" +
      "filter[order]=Value DESC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    urlInicio2 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[1] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[1] + " 00:00:00.0000000'&" +
      "filter[order]=Value DESC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    urlInicio3 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[2] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[2] + " 00:00:00.0000000'&" +
      "filter[order]=Value DESC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    urlInicio4 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[3] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[3] + " 00:00:00.0000000'&" +
      "filter[order]=Value DESC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    urlInicio5 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[4] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[4] + " 00:00:00.0000000'&" +
      "filter[order]=Value DESC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    //FECHA FINAL ACTUAL
    urlFinal = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + FechaInicial + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + FechaFinal + " 00:00:00.0000000'&" +
      "filter[order]=Value DESC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    //FECHA FINAL HISTORICO
    urlFinal1 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[0] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[0] + " 00:00:00.0000000'&" +
      "filter[order]=Value ASC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    urlFinal2 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[1] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[1] + " 00:00:00.0000000'&" +
      "filter[order]=Value ASC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    urlFinal3 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[2] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[2] + " 00:00:00.0000000'&" +
      "filter[order]=Value ASC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    urlFinal4 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[3] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[3] + " 00:00:00.0000000'&" +
      "filter[order]=Value ASC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    urlFinal5 = "http://"+this.server+"/api/DataLog2s?" +
      "filter[where][QuantityID]=129&" +
      "filter[where][SourceID]=" + SID + "&" +
      "filter[where][TimestampUTC][between][0]='" + ArrayFechaIF[4] + " 00:00:00.0000000'&" +
      "filter[where][TimestampUTC][between][1]='" + ArrayFechaFF[4] + " 00:00:00.0000000'&" +
      "filter[order]=Value ASC&" +
      "filter[where][Value][nlike]=0&" +
      "filter[limit]=1";

    return forkJoin(
      //DATOS DE INICIO DE PERIODO
      this.http.get(urlInicio),//0
      this.http.get(urlInicio1),//1
      this.http.get(urlInicio2),//2
      this.http.get(urlInicio3),//3
      this.http.get(urlInicio4),//4
      this.http.get(urlInicio5),//5
      //DATOS DE FIN DE PERIODO
      this.http.get(urlFinal),//6
      this.http.get(urlFinal1),//7
      this.http.get(urlFinal2),//8
      this.http.get(urlFinal3),//9
      this.http.get(urlFinal4),//10
      this.http.get(urlFinal5),//11
      //CONTAR DATOS NULOS
      this.http.get(urlNulos)//12 
    );
  }

  ConsumoTorre(FechaInicial, FechaFinal, SIDInicio, SIDFinal){
  let urlConsumo = "";
  //alert(FechaInicial+" - "+FechaFinal+" - "+SIDInicio+" - "+SIDFinal);
   urlConsumo = "http://"+this.server+"/api/ConsumoTorre?" +
      "FI=" + FechaInicial + "&" +
      "FF=" + FechaFinal + "&" +
      "SIDInicio=" + SIDInicio + "&" +
      "SIDFinal=" + SIDFinal;
    
    return this.http.get(urlConsumo); 
  }
}
