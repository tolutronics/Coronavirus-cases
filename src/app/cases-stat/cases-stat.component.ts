import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiService } from '../api.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-cases-stat',
  templateUrl: './cases-stat.component.html',
  styleUrls: ['./cases-stat.component.scss']
})
export class CasesStatComponent implements OnInit {
  stats: any;
  y:any;
  yesdata:any;
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

   getAll(){
  
    this.isLoadingResults = true;
    this.barChartLabels = [];
    const chartdata1: number[] = [];
    const chartdata2: number[] = [];
    const chartdata3: number[] = [];
    this.afs.collection('CoronavirusCases').valueChanges().subscribe(data => {
      data.forEach((stat:any) => {
        
        if(!this.barChartLabels.includes(stat.city)){
          this.barChartLabels.push(stat.city);
          this.afs.collection('CoronavirusCases', ref => ref.where('status','==', 'Positive' ).where('city', '==', stat.city)).valueChanges()
          .subscribe((res1: any) => {
            chartdata1.push(res1.length);
          });

          this.afs.collection('CoronavirusCases', ref => ref.where('status','==', 'Dead' ).where('city', '==', stat.city)).valueChanges()
          .subscribe((res2: any) => {
            chartdata2.push(res2.length);
          });


          this.afs.collection('CoronavirusCases', ref => ref.where('status','==', 'Recovered' ).where('city', '==', stat.city)).valueChanges()
          .subscribe((res3: any) => {
            chartdata3.push(res3.length);
          });



          
        }else{}

      });
    }, err => {
      this.isLoadingResults = true;
      console.log(err)
    });

    console.log('ngOnInit', chartdata1)
    console.log('ngOnInit', chartdata2)
    console.log('ngOnInit', chartdata3)



    this.barChartData = [
      {
        label: 'Positive',
        data: chartdata1,
        backgroundColor:'rgba(255, 165, 0, 0.5)'
      },
      { 
        label: 'Dead',
        data: chartdata2,
        backgroundColor: 'rgba(255, 0, 0, 0.5)'
      },
      { 
        label: 'Recovered',
        data: chartdata3,
        backgroundColor: 'rgba(0, 255, 0, 0.5)'
      }
    ];

    this.isLoadingResults = false;
  }

   getStatistic(status: string) {
    
    const chartcolor: string[] = [];
    const chartdata: number[] = [];

if (status=='All') {
   this.getAll();
}else{

 
    this.barChartData = [{ data: [], backgroundColor: [], label: this.label }];
    this.barChartLabels = [];
    this.afs.collection('CoronavirusCases', ref => ref.where('status','==', status )).valueChanges()
    .subscribe((data: any) => {
      this.stats = data;
     
      this.stats.forEach((stat) => {
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
    
      this.afs.collection('CoronavirusCases', ref => ref.where('status','==', status ).where('city', '==', city)).valueChanges()
      .subscribe((res: any) => {
        chartdata.push(res.length);
      });
      
    }
      this.barChartData = [{ data: chartdata, backgroundColor: chartcolor, label: this.label }];
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
    });
  }
}


  ngOnInit(): void {
    this.getStatistic(this.label);
  }
  changeStatus() {
    this.isLoadingResults = true;
    this.getStatistic(this.label);
  }

}
