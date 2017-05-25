
import {Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from "rxjs/Subscription";
import { ScreenService } from './../../../../fw/services/screen.service';

@Component({
  selector: 'app-bullets',
  templateUrl: './bullets.component.html',
  styleUrls: ['./bullets.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BulletsComponent implements OnInit, OnChanges {
  private chartData: Array<any>;
  @ViewChild('chart') private chartContainer: ElementRef;
  private data: Array<any>; // @Input() private data: Array<any>;
  
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private tooltip: any;
  private showtooltip = true;

  TATWHOP1s = [];

  private screenSubscription: Subscription;
  constructor(
    screenService: ScreenService) {

      this.screenSubscription = screenService.resize$.subscribe(() => this.onResize());
  }

  ngOnInit() {
    this.loadOperators();
    this.generateData();
    this.data = this.chartData;
    this.createChart();
    
    if (this.data) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }
 
   ngOnDestroy() {
      this.screenSubscription.unsubscribe();
  }

  onResize() {
  //  console.log('resizing');
     this.createChart();
    this.updateChart();
  }

  createChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    d3.select(element).selectAll('svg').remove();

    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    let xDomain = this.data.map(d => d[0]);
    let yDomain = [0, 110]; // [0, d3.max(this.data, d => d[1])];

    // create scales
    this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    // bar colors
    // this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);
    this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['#d95f02','#7570b3']);
//['#7fc97f','#beaed4','#fdc086']
//['#1b9e77','#d95f02','#7570b3']
//['#fbb4ae','#b3cde3','#ccebc5']
//http://colorbrewer2.org/#type=qualitative&scheme=Accent&n=3

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));
  }

  updateChart() {
    // update scales & axis
    this.xScale.domain(this.data.map(d => d[0]));
    this.yScale.domain([0, 110]); // ([0, d3.max(this.data, d => d[1])]);
    this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    let update = this.chart.selectAll('.bar')
      .data(this.data);

    // remove exiting bars
    update.exit().remove();

    // update existing bars
    this.chart.selectAll('.bar').transition()
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d[1]))
      .style('fill', (d, i) => this.colors(i));

    // add new bars
    let rects = update // avg
      .enter()
      .append('rect')
      .attr('id', (d, i) => 'rect'+i)
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i))
      .on("mouseover", function(d) { 
          d3.selectAll(".mytt")
          .html("<div>" + d[0] + "<br/><br/>"
          + "<span style='text-align:left;'>Min:</span>" 
          + "<span style='text-align:right;'>" + d[2] + "</span>" + "<br/>"
          + "Avg: " + d[3] + "<br/>"
          + "Tgt: " + d[4] + "<br/>"
          + "Act: " + d[1] + "</div>") 
          .style("left", (d3.event.offsetX) + "px")
          .style("top", (d3.event.pageY - 100) + "px")           
          .transition().duration(200)
          .style("opacity", .9);
      })
      .on("mouseout", function(d) {
          d3.selectAll(".mytt")
          .transition().duration(500)
          .style("opacity", 0);
      })
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[3]))
      .attr('height', d => this.height - this.yScale(d[3]));
 
      update // min
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]) + 10)
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth() -20)
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i+1))
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[2]))
      .attr('height', d => this.height - this.yScale(d[2]));

      update // jobs
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]) + (this.xScale.bandwidth() - 10) / 2)
      .attr('y', d => this.yScale(0))
      .attr('width', 10)
      .attr('height', 0)
      .style('fill', 'silver') // (d, i) => this.colors(i+2))
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[1]))
      .attr('height', d => this.height - this.yScale(d[1]));  

      update // target
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]) +5)
      .attr('y', d => this.yScale(0) - 30)
      .attr('width', this.xScale.bandwidth() -10)
      .attr('height', 0)
      .style('fill', 'white')
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[4]))
      .attr('height', 2);         

      update // min hash
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]) +10)
      .attr('y', d => this.yScale(d[2]))
      .attr('width', this.xScale.bandwidth() -20)
      .attr('height', 0)
      .style('fill', 'black')
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[2]))
      .attr('height', 2);    
  }
 
  generateData() {
    this.chartData = [];
    let barcount: number = (8 + Math.floor(Math.random() * 10));
    barcount = 20;
    for (let i = 0; i < barcount; i++) {
      let jobs:number = Math.floor(Math.random() * 100);
      let min:number = 20 + Math.floor(Math.random() * 20);
      let avg:number = 60 + Math.floor(Math.random() * 40);
      let target:number = 50 + Math.floor(Math.random() * 50);
      this.chartData.push([
        this.TATWHOP1s[i].WH_OPER_NAME, // 'Index ' + i, //`Index ${i}`,
        jobs, min, avg, target
      ]);
    }
   // console.log(this.chartData);
  }

  loadOperators() {
    
        this.TATWHOP1s = [
          {"WH_OPER_ID": "849", "WH_OPER_NAME": "Luz H"},             
          {"WH_OPER_ID": "2842", "WH_OPER_NAME": "Rosmary G"},        
          {"WH_OPER_ID": "534", "WH_OPER_NAME": "Vincent M"},         
          {"WH_OPER_ID": "648", "WH_OPER_NAME": "Jarolin P"},         
          {"WH_OPER_ID": "1125", "WH_OPER_NAME": "Maria D"},          
          {"WH_OPER_ID": "576", "WH_OPER_NAME": "Maria S"},           
          {"WH_OPER_ID": "0075", "WH_OPER_NAME": "Kathy D"},          
          {"WH_OPER_ID": "012", "WH_OPER_NAME": "Maria M"},           
          {"WH_OPER_ID": "1468", "WH_OPER_NAME": "Vanessa L"},        
          {"WH_OPER_ID": "1218", "WH_OPER_NAME": "Martha P"},         
          {"WH_OPER_ID": "028", "WH_OPER_NAME": "Dana C"},            
          {"WH_OPER_ID": "993", "WH_OPER_NAME": "Digna F"},           
          {"WH_OPER_ID": "1192", "WH_OPER_NAME": "Wilson V"},         
          {"WH_OPER_ID": "1282", "WH_OPER_NAME": "Lester M"},         
          {"WH_OPER_ID": "0620", "WH_OPER_NAME": "Steven R"},         
          {"WH_OPER_ID": "0914", "WH_OPER_NAME": "Luz S"},            
          {"WH_OPER_ID": "979", "WH_OPER_NAME": "Yajaira D"},         
          {"WH_OPER_ID": "001", "WH_OPER_NAME": "Ed Z"},              
          {"WH_OPER_ID": "007", "WH_OPER_NAME": "Mike R"},            
          {"WH_OPER_ID": "1489", "WH_OPER_NAME": "Laura V"},          
          {"WH_OPER_ID": "1519", "WH_OPER_NAME": "Juan V"},           
          {"WH_OPER_ID": "8760", "WH_OPER_NAME": "Roxana M"},         
          {"WH_OPER_ID": "3475", "WH_OPER_NAME": "Bianka F"},         
          {"WH_OPER_ID": "0002", "WH_OPER_NAME": "Laquentin A"},      
          {"WH_OPER_ID": "1106", "WH_OPER_NAME": "Francesco M"},      
          {"WH_OPER_ID": "1469", "WH_OPER_NAME": "Bianca F"},         
          {"WH_OPER_ID": "1644", "WH_OPER_NAME": "Juan C"}
        ]
  }
}
