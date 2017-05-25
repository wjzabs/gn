import { Injectable } from '@angular/core';
import {Response, Http, Headers, RequestOptions, ResponseContentType} from "@angular/http";
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as FileSaver from 'file-saver'; 

export interface POTORDR1 {
  PO_ORDER_NO;
VEND_CODE;
VEND_NAME;
INIT_OPER;
LAST_OPER;
INIT_DATE;
LAST_DATE;
PO_DATE_ORDERED;
PO_REFERENCE;
WHSE_CODE;
PO_STATUS;
PO_DATE_CANCELLED;
PO_DATE_SHIP_BY;
PO_DATE_ETA;
PO_SPEC_ORDR_NO;
FOB_CMT;
FACTORY_CODE;
PO_CONTACT;
PO_HDR_CTR_REV;
PO_NOTES;
PO_XMIT_IND;
PO_XMIT_BY;
PO_XMIT_DATE;
PO_XMIT_XNO;
PORT_CODE_ORIG;
PORT_CODE_DEST;
COST_CODE;
PO_DATE_CANCEL;
PO_FOB_DESC;
PO_SHIP_VIA;
PO_CARTON_MARKS;
ORDR_NO;
TERM_CODE;
PO_DATE_PRINTED;
PO_PRINTED_IND;
PO_MESSAGE;
CUST_CODE;
PO_REVISION_NOTE;
PO_BATCH_NO;
LABEL_RESP_CODE;
PO_APPR_NOTES;
PO_APPR_BY;
PO_APPR_DATE;
PO_APPR_PENDING;
PO_APPR_AMOUNT;
PO_COMM_PAYABLE_TO_BRKR;
PO_COMM_CHGBACK_TO_SUPP;
PO_COMM_PCT;
PO_HAS_PPK;
PO_APPR_QUEUE;
LC_CTL_NO;
PO_LABEL_URL;
PO_LABEL_ACCESS_CODE;
PO_LABEL_URL_ACTIVE;
PO_LABEL_URL_EXPIRES;
    PO_QTY_ORD;
    PO_QTY_SHP;
    PO_QTY_REC;
    PO_QTY_OPN;
    PO_AMT_ORD;
    PO_AMT_SHP;
    PO_AMT_REC;
    PO_AMT_OPN;
    PO_LINES_CONF;
    PO_LINES;
    PO_CTNS_ORD;
    PO_CTNS_SHP;
    PO_CTNS_OPN;
    PO_CUBE_ORD;
    PO_CUBE_SHP;
    PO_CUBE_OPN;
    PO_DATE_SHIP_BY_MIN;
    PO_DATE_ETA_MIN;
    PO_DATE_SHIP_BY_MAX;
    PO_DATE_ETA_MAX;
    CUST_NAME;
    ORDR_CANCEL_DATE;
}

@Injectable()
export class SettingsService {

    POTORDR1: any;
    POTORDR2: any;
   // POTORDR1s: POTORDR1[];
    POTORDR1s: any[];
    POTORDR2s: any[];

  constructor(private http: Http) {

  }
  
  private ABS_Authorization = 'abs';
  private baseUrl: string = 'http://localhost:21112' + '/api/NYA/';
        //  'http://localhost:21112/';
        //  'https://wjzdataservice.absolution1.com/';

  getHeaders() {
    let headers = new Headers();
    headers.append('Authorization', this.ABS_Authorization);   
    headers.append('Content-Type', "application/json"); 
    return { headers: headers };        
  }

  savePO(d) : Observable<any> {
    return  this.http.post(`${this.baseUrl}SavePO`, JSON.stringify(d), this.getHeaders())
      .map((response:Response) => {
        return response.json();
      })
  }

  getPOPDFp(PO_ORDER_NO) {
    let body = {"PO_ORDER_NO": PO_ORDER_NO};
    let headers = new Headers();
    headers.append('Content-Type', 'application/json'); //x-www-form-urlencoded
    headers.append('Accept', 'application/pdf'); 
    headers.append('Authorization', this.ABS_Authorization); 
    
    let options = new RequestOptions({headers: headers})
    // Ensure you set the responseType to Blob.
    options.responseType = ResponseContentType.Blob;

    return  this.http.post(`${this.baseUrl}GetPOPDFp`, body, options) // { headers: headers })
      .map((response:Response) => {
        //console.log(response);

      // Removed checking of valid response
 
      let fileBlob = response.blob();
      let blob = new Blob([fileBlob], { 
         type: 'application/pdf' // must match the Accept type
      });
      
      let filename = 'mypdf.pdf';
      FileSaver.saveAs(blob, filename);
      
      return response;
      })
  }

  getPOPDF(d) {
   // console.log(`${this.baseUrl}GetPOPDF`);
   // this.http.get(`${this.baseUrl}GetPOPDF`, this.getHeaders());
 //  this.http.get(`${this.baseUrl}GetPOPDF`)
 //   .toPromise()
//    .then(function(data) {window.open(data)})
    
    window.open(`${this.baseUrl}GetPOPDF`);

 //   let xhr = new XMLHttpRequest();
 //   xhr.open("GET", `${this.baseUrl}GetPOPDF`, true);
    // xhr.setRequestHeader("Content-type", "application/json");
 //   xhr.send();
   // console.log(xhr.responseText);
    // xhr.onload = function () {
    //   let response = JSON.parse(xhr.responseText);
    //   console.log(response);
    // };
  }

  getOpenPOs() : Observable<any> {
    // return  this.http.post(`${this.baseUrl}GetMachineLocations`, null, this.getHeaders())
    return  this.http.post(`${this.baseUrl}GetOpenPOs`, this.getHeaders())
      .map((response:Response) => {
       // let x:Object = response.json();
        let x:any = response.json();
        this.POTORDR1s =x.POTORDR1s;
        return this.POTORDR1s;
      })
  }

  getOpenPOsByPort() : Observable<any> {
    // return  this.http.post(`${this.baseUrl}GetMachineLocations`, null, this.getHeaders())
    return  this.http.post(`${this.baseUrl}GetOpenPOsByPort`, this.getHeaders())
      .map((response:Response) => {
        // let x:any = response.json();
        return response.json();
      })
  }

  getPO (PO_ORDER_NO) : Observable<any> {
    let body = {"PO_ORDER_NO": PO_ORDER_NO};
    let headers = new Headers();
    headers.append('Content-Type', 'application/json'); //x-www-form-urlencoded
    headers.append('Authorization', this.ABS_Authorization); 
    
    return  this.http.post(`${this.baseUrl}GetPO`, body, { headers: headers })
      .map((response:Response) => {
       // this.POTORDR1 = response.json().POTORDR1;
        this.POTORDR2s = response.json().POTORDR2s;
        return this.POTORDR2s;
      })
  }
}