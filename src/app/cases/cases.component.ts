import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Cases } from '../cases';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSort} from '@angular/material/sort';
@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age', 'status', 'state'];
  // data: Cases[] = [];
  dataSource: MatTableDataSource<any>; 
  ndat:any;
  noData=false;
  navData;
  lent:any=0;
  @ViewChild(MatSort, {static: true}) sort: any;
  
 // dataSource:any={};
  isLoadingResults = true;
  constructor(private route:Router,private _snackBar: MatSnackBar,private afs: AngularFirestore,private api: ApiService) {  }

  open(ev:string){
    this.route.navigate(['/cases-details', this.navData={
      name: ev
     
  }] )
  }

  ngOnInit(): void {
    
    this.afs.collection('CoronavirusCases').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data); 
      this.dataSource.sort = this.sort;

  //     console.log('my data',data); 
  //     this.ndat= data;
  
  // this.lent=this.ndat.length;
  
  // });
  // for (let i = 0; i < this.lent; i++) {
  
  //   this.afs.collection<any>('CoronavirusCases').doc<any>(`case ${i+1}`).valueChanges().subscribe(res => {
    
      console.log('new data source',data);
      if (data.length==0) {

        this._snackBar.open("No Record Yet", "Ok", {
          duration: 3000,
        });
        this.isLoadingResults = false;
      }else{
      }
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
       this.isLoadingResults = true;
     
    });
   
  }
  

}
