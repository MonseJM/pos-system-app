import { Component,OnInit } from '@angular/core';
import { AnalyticsService } from './analisis.service';
import {Chart} from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
;


@Component({
  selector: 'app-analisis',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './analisis.html',
  styleUrl: './analisis.scss',
})
export class Analisis implements OnInit {

  dailySales: any[] = [];
  summary: any = {};
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadData();
  }

loadData(){

  this.analyticsService.getDaily()
    .subscribe(res => {
      this.dailySales = res;
      this.createChart();
    });

  this.analyticsService.getSummary()
    .subscribe(res => {
      this.summary = res;
      this.createDonutChart(); 
    });

}

createChart(){

  const labels = this.dailySales.map(x => 
    new Date(x.date).toLocaleDateString()
  );

  const totals = this.dailySales.map(x => x.total);

  new Chart("salesChart", {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ventas',
        data: totals,
        borderWidth: 2,
        tension: 0.3
      }]
    }
  });

}

startDate: string = '';
endDate: string = '';

filter(){
  if(!this.startDate || !this.endDate) return;

  this.dailySales = this.dailySales.filter(x => {
    const date = new Date(x.date);
    return date >= new Date(this.startDate) && date <= new Date(this.endDate);
  });

  this.createChart();
}

createDonutChart(){

  const totalSales = this.summary?.totalSales || 0;
  const totalTax = this.summary?.totalTax || 0;

  new Chart("donutChart", {
    type: 'doughnut',
    data: {
      labels: ['Ventas', 'Impuestos'],
      datasets: [{
        data: [totalSales, totalTax]
      }]
    }
  });

}

}


