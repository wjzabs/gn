import { Component, OnInit } from '@angular/core';
import { SettingsService } from "app/settings/settings.service";
// import { POTORDR1 } from "app/settings/settings.service";
import {DataTableModule,SharedModule} from 'primeng/primeng';
import {DataTableModule as DataTableModule2 } from "angular2-datatable";

@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.css']
})
export class POComponent implements OnInit {
  
  // POTORDR1s: POTORDR1[];
  POTORDR1s: any[];
  errorMessage: any;
  cols: any[];
  brands: any[];
  selectedPOs: any[];
  showPO: string;
POTORDR2s: any[];


    public data;
    public data2;
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "PO_ORDER_NO";
    public sortOrder = "asc";

  constructor( private settingsService: SettingsService) { }

  getPDF() {
    if(!this.selectedPOs || this.selectedPOs.length == 0) {
      alert('no POs selected')
    } else{
      console.log(this.selectedPOs);
     // this.settingsService.getPOPDF("");
      this.settingsService.getPOPDFp("047146")
        .subscribe((x) => {
         // console.log(x);
        })
    }
  }
  //         let filename = x.headers['x-filename'];
  //         let contentType = x.headers['content-type']
  //         let linkElement = document.createElement('a');
  //         try {
  //           let blob = new Blob([x], {type: contentType});
  //           let url = window.URL.createObjectURL(blob);
  //           linkElement.setAttribute('href',url);
  //           linkElement.setAttribute('download',filename);
  //           let clickEvent = new MouseEvent('click', {
  //             "view": window,
  //             "bubbles": true,
  //             "cancelable": false
  //           });
  //           linkElement.dispatchEvent(clickEvent);

  //           }
  //         } catch(ex) {
  //           console.log(ex);
  //         }
  //       });
  //   }
  // }

  ngOnInit() {
    
        this.cols = [
            {field: 'PO_ORDER_NO', header: 'PO No'},
            {field: 'VEND_CODE', header: 'Supplier'},
            {field: 'PO_DATE_ORDERED', header: 'PO Date'} 
        ];

        this.brands = [];
        this.brands.push({label: 'All Brands', value: null});
        this.brands.push({label: 'Audi', value: 'Audi'});
        this.brands.push({label: 'BMW', value: 'BMW'});
        this.brands.push({label: 'Fiat', value: 'Fiat'});
        this.brands.push({label: 'Honda', value: 'Honda'});
        this.brands.push({label: 'Jaguar', value: 'Jaguar'});
        this.brands.push({label: 'Mercedes', value: 'Mercedes'});
        this.brands.push({label: 'Renault', value: 'Renault'});
        this.brands.push({label: 'VW', value: 'VW'});
        this.brands.push({label: 'Volvo', value: 'Volvo'});

    this.settingsService.getOpenPOs()
    .subscribe(
            x => {
        if (x) {
          console.log(x);
          this.POTORDR1s = x; // x.slice(x.length-5);
          this.POTORDR1s =   x.slice(x.length-30); // performance sucks primeNg DataTable
          this.data = x; //x.slice(x.length-30); // data.json();
        
        }
        else {
          this.POTORDR1s = null; // this.BSTCBSCM_empty;
        }
      },
      error => this.errorMessage = <any>error);
  }




    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.PO_FOB_DESC.length;
    }

    showPODetails(PO) {

    this.settingsService.getPO(PO)
    .subscribe(
            x => {
        if (x) {
          console.log(x);
          this.POTORDR2s = x; // x.slice(x.length-5);
          this.data2 = x; //x.slice(x.length-30); // data.json();
          this.showPO = PO;
        }
        else {
          this.POTORDR2s = null; // this.BSTCBSCM_empty;
        }
      },
      error => this.errorMessage = <any>error);
    }

}