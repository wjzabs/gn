import { SettingsService } from './../../settings.service';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ABSFunctions } from 'app/settings/abs'

@Component({
  selector: 'app-po-ports',
  templateUrl: './po-ports.component.html',
  styleUrls: ['./po-ports.component.css']
})
export class PoPortsComponent implements OnInit {

  private xAxis: any;
  private yAxis: any;
  private radius: any;
  private color: any;

  private margin: any;
  private width: any;
  private height: any;
  private svg: any;
  private xScale: any;
  private yScale: any;
  private data;
  private zoom: any;
  private legend;
  private gX: any;
  private gY: any;
  private selectedItem;
private view: any;

  POTORDR1s: any[];
  PWs: any[];
  errorMessage: any;
  // cols: any[];
  // brands: any[];
  // selectedPOs: any[];
  // showPO: string;
  // POTORDR2s: any[];

  constructor(
    private absFunctions: ABSFunctions,
    private settingsService: SettingsService) { }

  ngOnInit() {

    //http://blockbuilder.org/syntagmatic/ba23d525f8986cb0ebf30a5dd30c9dd2

    // this.data = [
    //   { "CUST_CODE": "FAMILY DOLL", "PO_ORDER_NO": "047144", "VEND_CODE": "TAICANG", "PO_CTNS_OPN": 23, "PO_DATE_SHIP_BY": "2017-06-14T00:00:00", "PO_QTY_OPN": 37 },
    //   { "CUST_CODE": "WALMART", "PO_ORDER_NO": "047280", "VEND_CODE": "SUZHOU", "PO_CTNS_OPN": 24, "PO_DATE_SHIP_BY": "2017-07-24T00:00:00", "PO_QTY_OPN": 81 },
    //   { "CUST_CODE": "", "PO_ORDER_NO": "047241", "VEND_CODE": "LUCYZONE", "PO_CTNS_OPN": 77, "PO_DATE_SHIP_BY": "2017-08-04T00:00:00", "PO_QTY_OPN": 59 },
    //   { "CUST_CODE": "FAMILY DOLL", "PO_ORDER_NO": "047231", "VEND_CODE": "SINOHONEST", "PO_CTNS_OPN": 50, "PO_DATE_SHIP_BY": "2017-05-14T00:00:00", "PO_QTY_OPN": 60 },
    //   { "CUST_CODE": "WALMART", "PO_ORDER_NO": "047174", "VEND_CODE": "LAPSUNSTRA", "PO_CTNS_OPN": 31, "PO_DATE_SHIP_BY": "2017-06-30T00:00:00", "PO_QTY_OPN": 53 }
    // ]




    this.settingsService.getOpenPOsByPort()
      .subscribe(
      x => {
        if (x) {
          // console.log(x);
          //  this.POTORDR1s = x; // x.slice(x.length-5);
          //  this.POTORDR1s =   x.slice(x.length-30); // performance sucks primeNg DataTable
          this.POTORDR1s = x.POTORDR1s; //x.slice(x.length-30); // data.json();
          this.PWs = x.POTORDR1_PORT_WHSEs


          if (this.PWs.length) {
          this.PWs.sort(function (a, b) {
            if (a.PORT_CODE_ORIG + a.WHSE_CODE < b.PORT_CODE_ORIG + b.WHSE_CODE)
              return -1;
            if (a.PORT_CODE_ORIG + a.WHSE_CODE > b.PORT_CODE_ORIG + b.WHSE_CODE)
              return 1;
            return 0;
          });

            this.selectedItem = this.PWs[1];
            this.drawChart();
          } else {
            this.selectedItem = null;
          }
        }
        else {
          // this.POTORDR1s = null; // this.BSTCBSCM_empty;
          this.data = null; // this.BSTCBSCM_empty;
        }
      },
      error => this.errorMessage = <any>error);

    // if (this.data) {
    //   this.drawChart();
    // }
  }

 // parseTime = d3.timeParse("%d-%b-%y");

  drawChart() {

    this.data = this.POTORDR1s.filter(d => d.PORT_CODE_ORIG == this.selectedItem.PORT_CODE_ORIG && d.WHSE_CODE == this.selectedItem.WHSE_CODE);
    console.log(this.data);

    let that = this; // need that whenever this is used in a function that is part of a return

    this.margin = { top: 30, right: 150, bottom: 40, left: 50 };
    this.width = 1300 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;

    d3.select("svg").remove();


    // this.zoom = d3.zoom()
    // .scaleExtent([1, 40])
    // .translateExtent([[-100, -100], [this.width + 90, this.height + 100]])
    // .on("zoom", this.zoomed);


    this.svg = d3.select("#chart")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    //  .call(this.zoom);

    // this.xScale = d3.scaleLinear()
    this.xScale = d3.scaleTime()
      .range([0, this.width]);

    //scaleLog
    //scaleLinear
    this.yScale = d3.scaleLog()
      .range([this.height, 0]);

    this.radius = d3.scaleSqrt()
      .range([2, 8]);

    this.xAxis = d3.axisBottom(this.xScale)
      .tickSize(-1 * this.height)
    //  .scale(this.xScale);

    this.yAxis = d3.axisLeft(this.yScale)
      .tickSize(-1 * this.width)
//       .tickFormat(function (d) {
//         return this.yScale.tickFormat(4,d3.format(",d"))(d)
// })


    //  .scale(this.yScale)

    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    // this.color = d3.scaleCategory20();
    // this.color = d3.scaleCategory20().domain([0, this.data.length]).range(<any[]>['#d95f02', '#7570b3', '#d95f02', '#7570b3', '#d95f02', '#7570b3']);

    let VEND_CODEs = {}, output = [], l = this.data.length, i, j;
    j = 0;
    for (i = 0; i < l; i++) {
      let VEND_CODE = this.data[i].VEND_CODE;
      // if( VEND_CODEs[this.data[i].VEND_CODE]) continue;
      if (!VEND_CODEs[VEND_CODE]) {
        j += 1;
        VEND_CODEs[VEND_CODE] = j;
        output.push({ "VEND_CODE": VEND_CODE, "PO_CTNS_OPN": 0 });
        // VEND_CODEs[VEND_CODE] = {"VEND_CODE":VEND_CODE, "PO_CTNS_OPN": 0};
      } else {
        j = VEND_CODEs[VEND_CODE];
      }
      // VEND_CODEs[VEND_CODE].PO_CTNS_OPN += this.data[i].PO_CTNS_OPN;
      // output[VEND_CODEs[VEND_CODE]-1].PO_CTNS_OPN += this.data[i].PO_CTNS_OPN
      output[j - 1].PO_CTNS_OPN += this.data[i].PO_CTNS_OPN
    }
    // console.log("VEND_CODEs",VEND_CODEs);

    // for( i=0; i<VEND_CODEs.length; i++) {
    //   output.push(VEND_CODEs[i]);
    // }


    // console.log("output",output);  // why does this display as sorted already?

    output.sort(function (a, b) { return b.PO_CTNS_OPN - a.PO_CTNS_OPN })

    if (output.length > 10) {
      output = output.slice(0, 9);
    };

    VEND_CODEs = {};
    for (i = 0; i < output.length; i++) {
      let VEND_CODE = output[i].VEND_CODE;
      VEND_CODEs[VEND_CODE] = true;
    }
    //   console.log("vendors",VEND_CODEs);
    //    console.log("output 10",output);


    // console.log(this.data);
    // data pre-processing
    this.data.forEach(function (d: any) {
      d.y = +d["PO_CTNS_OPN"];
      d.r = +d["PO_QTY_OPN"];
      // d.PO_DATE_SHIP_BY = dt => d3.timeParse("%d-%b-%y");
      // d.PO_DATE_SHIP_BY = that.parseTime(d.PO_DATE_SHIP_BY);
      // d.PO_DATE_SHIP_BY = Date.parse(d.PO_DATE_SHIP_BY);
      d.x = Date.parse(d.PO_DATE_SHIP_BY);
      d.VEND_CODE2 = VEND_CODEs[d.VEND_CODE] ? d.VEND_CODE : 'OTHER';
    });

    // let minDate = d3.min(this.data, d => d["PO_DATE_SHIP_BY"]);
    // let maxDate = d3.min(this.data, d => d["PO_DATE_SHIP_BY"]);
    // this.xScale.domain([minDate,maxDate]);

    // .domain(d3.extent(that.data, function(d) { return d["PO_DATE_SHIP_BY"]; }))

    this.data.sort(function (a: any, b: any) { return b.r - a.r; });

    let dateNow = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    let minX = dateNow;
    let dateNow2 = Date.now() + 60 * 24 * 60 * 60 * 1000; // 30 days ago
    let maxX = dateNow2; // d3.min(this.data, d => d["x"]);

    this.xScale.domain([minX, maxX]).nice();
    this.xScale.clamp(true);

    // this.xScale.domain(d3.extent(this.data, function (d: any) {
    //   return d.x;
    // })).nice();

    this.yScale.domain(d3.extent(this.data, function (d: any) {
      return d.y;
    })).nice();

    this.radius.domain(d3.extent(this.data, function (d: any) {
      return d.r;
    })).nice();


// var gX = svg.append("g")
//     .attr("class", "axis axis--x")
//     .call(xAxis);

// var gY = svg.append("g")
//     .attr("class", "axis axis--y")
//     .call(yAxis);


    this.gX = this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class", "x axis")
      .call(this.xAxis);

    this.gY = this.svg.append("g")
      .attr("transform", "translate(0,0)")
      .attr("class", "y axis")
      .call(this.yAxis);

    let group = this.svg.selectAll("g.bubble")
      .data(this.data)
      .enter().append("g")
      .attr("class", "bubble")
      .attr("transform", function (d, i) {
        return "translate(" + that.xScale(d.x) + "," + that.yScale(d.y) + ")"
      });

    group
      .append("circle")
      .attr("r", function (d) { return that.radius(d.r); })
      .style("fill", function (d) {
        return that.color(d["VEND_CODE2"]);
      })
      .on("mouseover", function (d) {
        // console.log(d3.event);
        let CUST_CODE = d["CUST_CODE"] ? " " + d["CUST_CODE"] : " (Stock)";
        d3.selectAll(".mytt")
          .html("<div>PO:" + d["PO_ORDER_NO"] + CUST_CODE + "<br/><br/>"
          + "<span style='text-align:left;'>Supplier:</span>"
          + "<span style='text-align:right;'>" + d["VEND_CODE"] + "</span>" + "<br/>"
          + "Cartons: " + d["PO_CTNS_OPN"] + "<br/>"
          + "ETD: " + that.absFunctions.formatDate(d["PO_DATE_SHIP_BY"], "MM/dd/yyyy") + "<br/>"
          + "Units: " + d["PO_QTY_OPN"] + "</div>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 120) + "px")
          .transition().duration(200)
          .style("opacity", .9);
      })
      .on("mouseout", function (d) {
        d3.selectAll(".mytt")
          .transition().duration(500)
          .style("opacity", 0);
      })

    group
      .append("text")
      .attr("x", function (d) { return that.radius(d.r); })
      .attr("alignment-baseline", "middle")
      .text(function (d) {
        return d["PO_ORDER_NO"];
      // })
      // .append("text")
      // .attr("x", function (d) { return that.radius(d.r); })
      // .attr("alignment-baseline", "bottom")
      // .text(function (d) {
      //   return d["PO_ORDER_NO"];
      });

    this.svg.append("text")
      .attr("x", 6)
      .attr("y", -2)
      .attr("class", "label")
      .text("Cartons");

    this.svg.append("text")
      .attr("x", this.width - 2)
      .attr("y", this.height - 6)
      .attr("text-anchor", "end")
      .attr("class", "label")
      .text("ETD");

    this.legend = this.svg.selectAll(".legend")
      .data(this.color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) { return "translate(2," + i * 14 + ")"; });

    this.legend.append("rect")
      .attr("x", this.width)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", this.color);

    this.legend.append("text")
      .attr("x", this.width + 16)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d) { return d; });

    this.legend.on("mouseover", function (type) {
      d3.selectAll(".legend")
        .style("opacity", 0.1);
      d3.select(this)
        .style("opacity", 1);
      d3.selectAll(".bubble")
        .style("opacity", 0.1)
        .filter(function (d) { return d["VEND_CODE2"] == type; })
        .style("opacity", 1);
    })
      .on("mouseout", function (type) {
        d3.selectAll(".legend")
          .style("opacity", 1);
        d3.selectAll(".bubble")
          .style("opacity", 1);
      });


// this.view = this.svg.append("rect")
//     .attr("class", "view")
//     .attr("x", 0.5)
//     .attr("y", 0.5)
//     .attr("width", this.width - 1)
//     .attr("height", this.height - 1);


// this.svg.call(this.zoom);

  }


  listClick(event, newValue) {
    console.log(newValue);
    this.selectedItem = newValue;  // don't forget to update the model here
    this.drawChart();
  }


 
//   zoomed() {
//   this.view.attr("transform", d3.event.transform);
//   this.gX.call(this.xAxis.scale(d3.event.transform.rescaleX(this.xScale)));
//   this.gY.call(this.yAxis.scale(d3.event.transform.rescaleY(this.yScale)));
// }
//  resetted() {
//   this.svg.transition()
//       .duration(750)
//       .call(this.zoom.transform, d3.zoomIdentity);
// }


}