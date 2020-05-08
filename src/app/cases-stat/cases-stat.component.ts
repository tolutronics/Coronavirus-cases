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
  y:any;
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
    this.barChartLabels = [];
    const chartdata: number[] = [];
    if (status=="All") {
      console.log(status)
      for (let i = 0; i < 3; i++) {
        if (i=1) {
        this.y='Positive';
        this.barChartLabels.push(this.y)
        this.afs.collection('CoronavirusCases', ref => ref.where('status','==', this.y )).valueChanges()
        .subscribe((data: any) => {
         chartdata.push(data.length)
        });
        }if(i=2){
         this.y='Dead';
         this.barChartLabels.push(this.y)
         this.afs.collection('CoronavirusCases', ref => ref.where('status','==', this.y )).valueChanges()
         .subscribe((data: any) => {
          chartdata.push(data.length)
         });
        }if(i=3){
         this.y='Recovered';
         this.barChartLabels.push(this.y)
         this.afs.collection('CoronavirusCases', ref => ref.where('status','==', this.y )).valueChanges()
         .subscribe((data: any) => {
          chartdata.push(data.length)
         });
         }
        
       

      }
      console.log(this.barChartLabels);
      console.log(chartdata);
    }
    this.barChartData = [{ data: [], backgroundColor: [], label: this.label }];
    this.barChartLabels = [];
    this.afs.collection('CoronavirusCases', ref => ref.where('status','==', status )).valueChanges()
    .subscribe((data: any) => {
      this.stats = data;
     
      console.log('chartdata init',chartdata)
      const chartcolor: string[] = [];
      console.log('my stats',this.stats.length);
      this.stats.forEach((stat) => {
        console.log('each statsss', stat);
        console.log(stat.city);
        if(!this.barChartLabels.includes(stat.city)){
          this.barChartLabels.push(stat.city);
        }else{}
        

        
        if (this.label === 'Positive') {
          chartcolor.push('rgba(255, 165, 0, 0.5)');
        } else if (this.label === 'Dead') {
          chartcolor.push('rgba(255, 0, 0, 0.5)');
        } else {
          chartcolor.push('rgba(0, 255, 0, 0.5)');
        }
    });
    for (let i = 0; i < this.barChartLabels.length; i++) {
      const city = this.barChartLabels[i];
      console.log('my city', city);
    
      this.afs.collection('CoronavirusCases', ref => ref.where('status','==', status ).where('city', '==', city)).valueChanges()
      .subscribe((res: any) => {
        chartdata.push(res.length);
      });
      
    }
    console.log('my chartdata',chartdata)
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
