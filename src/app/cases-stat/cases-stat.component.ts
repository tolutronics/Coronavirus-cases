import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiService } from '../api.service';
import { Statistic } from '../statistic';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-cases-stat',
  templateUrl: './cases-stat.component.html',
  styleUrls: ['./cases-stat.component.scss']
})
export class CasesStatComponent implements OnInit {
  stats: any;
  label = 'Positive';
  isLoadingResults = true;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [{ data: [], backgroundColor: [], label: this.label }];
  constructor(private afs: AngularFirestore,private api: ApiService) { }

  getStatistic(status: string) {
    this.barChartData = [{ data: [], backgroundColor: [], label: this.label }];
    this.barChartLabels = [];
    this.afs.collection('CoronavirusCases', ref => ref.where('status','==', status )).valueChanges()
    .subscribe((res: any) => {
      this.stats = res;
      const chartdata: number[] = [];
      const chartcolor: string[] = [];
      this.stats.forEach((stat) => {
        this.barChartLabels.push(stat.city);
        this.afs.collection('CoronavirusCases', ref => ref.where('status','==', status ).where('city', '==', stat.city)).valueChanges()
    .subscribe((res: any) => {
        chartdata.push(res.length);
        if (this.label === 'Positive') {
          chartcolor.push('rgba(255, 165, 0, 0.5)');
        } else if (this.label === 'Dead') {
          chartcolor.push('rgba(255, 0, 0, 0.5)');
        } else {
          chartcolor.push('rgba(0, 255, 0, 0.5)');
        }
      });
    });
      this.barChartData = [{ data: chartdata, backgroundColor: chartcolor, label: this.label }];
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  ngOnInit(): void {
    this.getStatistic(this.label);
  }
  changeStatus() {
    this.isLoadingResults = true;
    this.getStatistic(this.label);
  }

}
