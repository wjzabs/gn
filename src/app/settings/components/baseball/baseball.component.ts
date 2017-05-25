import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-baseball',
  templateUrl: './baseball.component.html',
  styleUrls: ['./baseball.component.css']
})
export class BaseballComponent implements OnInit {
 
  private xAxis: any;
  private yAxis: any;
  private radius: any;
  private color: any;

  private margin: any;
  private width: any;
  private height: any;
  private svg: any;
  private xscale: any;
  private yscale: any;
  //private that: any;
  private data;
  private legend;

  constructor() { }

  ngOnInit() {

    // var that = this;
    // d3.csv("Baseball.csv", function (error, data) {
    //   that.data = data;
    //   console.log(data);
    // });

//http://blockbuilder.org/syntagmatic/ba23d525f8986cb0ebf30a5dd30c9dd2

    this.data = [
      { "name1": "Al", "name2": "Newman", "team86": "Min", "runs86": 23, "atbat86": 185, "hits86": 37 },
      { "name1": "Alan", "name2": "Ashby", "team86": "Hou", "runs86": 24, "atbat86": 315, "hits86": 81 },
      { "name1": "Alan", "name2": "Newman", "team86": "Det", "runs86": 77, "atbat86": 574, "hits86": 59 },
      { "name1": "Alan", "name2": "Trammell", "team86": "Bal", "runs86": 50, "atbat86": 400, "hits86": 60 },
      { "name1": "Alex", "name2": "Wiggins", "team86": "LA", "runs86": 31, "atbat86": 202, "hits86": 53 }
    ]

      // "","name1","name2","atbat86","hits86","homer86","runs86","rbi86","walks86","years","atbat","hits","homeruns","runs","rbi","walks","league86","div86","team86","posit86","outs86","assist86","error86","sal87","league87","team87"
      // "1","","",185,37,1,23,8,21,2,214,42,1,30,9,24,"N","E","Mon","2B",76,127,7,70,"A",""
      // "2","","",315,81,7,24,38,39,14,3449,835,69,321,414,375,"N","W","Hou","C",632,43,10,475,"N",""
      // "3","","",574,159,21,107,75,59,10,4631,1300,90,702,504,488,"A","E","Det","SS",238,445,22,517.143,"A",""
      // "4","","",239,60,0,30,11,22,6,1941,510,4,309,103,207,"A","E","Bal","2B",121,151,6,700,"A",""
      // "5","","",202,53,4,31,26,27,9,1876,467,15,192,186,161,"N","W","LA","C",304,45,11,512.5,"N",""

      if (this.data) {
        this.drawChart();
      }

    }

  // getData(error, data) {
  //   this.data = data;
  // }

  drawChart() {

    let that = this;

        this.margin = { top: 30, right: 50, bottom: 40, left: 50 };
        this.width = 960 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        this.svg = d3.select("#chart")
          .append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.xscale = d3.scaleLinear()
          .domain([0, 800])
          .range([0, this.width]);

        this.yscale = d3.scaleLinear()
          .range([this.height, 0]);

        this.radius = d3.scaleSqrt()
          .range([2, 8]);

        // this.xAxis = d3.axisBottom()
        //   .tickSize(-1 * this.height)
        //   .scale(this.xscale);


        // this.yAxis = d3.axisLeft()
        //   .tickSize(-1 * this.width)
        //   .scale(this.yscale)

   // this.color = d3.scaleCategory20();
    this.color = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['#d95f02', '#7570b3','#d95f02', '#7570b3','#d95f02', '#7570b3']);
    
        // d3.csv("Baseball.csv", function (error, data) {
        console.log(this.data);
        // data pre-processing
        this.data.forEach(function (d: any) {
          d.y = +d["runs86"];
          d.x = +d["atbat86"];
          d.r = +d["hits86"];
        });





        this.data.sort(function (a: any, b: any) { return b.r - a.r; });

        this.yscale.domain(d3.extent(this.data, function (d: any) {
          return d.y;
        })).nice();

        this.radius.domain(d3.extent(this.data, function (d: any) {
          return d.r;
        })).nice();

        // this.svg.append("g")
        //   .attr("transform", "translate(0," + this.height + ")")
        //   .attr("class", "x axis")
        //   .call(this.xAxis);
        this.svg.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .attr("class", "x axis")
          .call(d3.axisBottom(this.xscale).tickSize(-1 * this.height)); 
        // this.xAxis = d3.axisBottom(this.xscale)
        //   .tickSize(-1 * this.height)
        //   .scale(this.xscale);

    // this.xAxis = svg.append('g')
    //   .attr('class', 'axis axis-x')
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
    //   .call(d3.axisBottom(this.xscale));


        // this.svg.append("g")
        //   .attr("transform", "translate(0,0)")
        //   .attr("class", "y axis")
        //   .call(this.yAxis);
        this.svg.append("g")
          .attr("transform", "translate(0,0)")
          .attr("class", "y axis")
          .call(d3.axisLeft(this.yscale).tickSize(-1 * this.width));

    // this.yAxis = svg.append('g')
    //   .attr('class', 'axis axis-y')
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    //   .call(d3.axisLeft(this.yScale));

        // this.yAxis = d3.axisLeft()
        //   .tickSize(-1 * this.width)
        //   .scale(this.yscale)


        var group = this.svg.selectAll("g.bubble")
          .data(this.data)
          .enter().append("g")
          .attr("class", "bubble")
          .attr("transform", function (d) {
            return "translate(" + that.xscale(d.x) + "," + that.yscale(d.y) + ")"
          });

        group
        .append("circle")
          .attr("r", function (d) { return that.radius(d.r); })
          .style("fill", function (d) {
            return that.color(d["team86"]);
          })

      group
        .append("text")
          .attr("x", function (d) { return that.radius(d.r); })
          .attr("alignment-baseline", "middle")
          .text(function (d) {
            return d["name1"] + " " + d["name2"];
          });

        this.svg.append("text")
          .attr("x", 6)
          .attr("y", -2)
          .attr("class", "label")
          .text("Runs (86)");

        this.svg.append("text")
          .attr("x", this.width - 2)
          .attr("y", this.height - 6)
          .attr("text-anchor", "end")
          .attr("class", "label")
          .text("At Bats (86)");

        this.legend = this.svg.selectAll(".legend")
          .data(that.color.domain())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function (d, i) { return "translate(2," + i * 14 + ")"; });

        this.legend.append("rect")
          .attr("x", this.width)
          .attr("width", 12)
          .attr("height", 12)
          .style("fill", that.color);

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
            .filter(function (d) { return d["team86"] == type; })
            .style("opacity", 1);
        })
          .on("mouseout", function (type) {
            d3.selectAll(".legend")
              .style("opacity", 1);
            d3.selectAll(".bubble")
              .style("opacity", 1);
          });
        // });

      }
}