import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

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
  private xscale: any;
  private yscale: any;
  private data;
  private legend;

  constructor() { }

  ngOnInit() {

    //http://blockbuilder.org/syntagmatic/ba23d525f8986cb0ebf30a5dd30c9dd2

    this.data = [
      { "name1": "Al", "name2": "Newman", "team86": "Min", "runs86": 23, "atbat86": 85, "hits86": 37 },
      { "name1": "Ports", "name2": "Ashby", "team86": "Hou", "runs86": 24, "atbat86": 315, "hits86": 81 },
      { "name1": "Ports", "name2": "Newman", "team86": "Det", "runs86": 77, "atbat86": 174, "hits86": 59 },
      { "name1": "Ports", "name2": "Trammell", "team86": "Bal", "runs86": 50, "atbat86": 400, "hits86": 60 },
      { "name1": "Alex", "name2": "Wiggins", "team86": "LA", "runs86": 31, "atbat86": 602, "hits86": 53 }
    ]

    if (this.data) {
      this.drawChart();
    }
  }

  drawChart() {

    let that = this; // need that whenever this is used in a function that is part of a return

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

    this.xAxis = d3.axisBottom(this.xscale)
      .tickSize(-1 * this.height)
    //  .scale(this.xscale);

    this.yAxis = d3.axisLeft(this.yscale)
      .tickSize(-1 * this.width)
    //  .scale(this.yscale)

    // this.color = d3.scaleCategory20();
    this.color = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['#d95f02', '#7570b3', '#d95f02', '#7570b3', '#d95f02', '#7570b3']);

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

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class", "x axis")
      .call(this.xAxis);

    this.svg.append("g")
      .attr("transform", "translate(0,0)")
      .attr("class", "y axis")
      .call(this.yAxis);

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