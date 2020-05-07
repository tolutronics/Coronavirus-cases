import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Cases } from '../cases';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-cases-details',
  templateUrl: './cases-details.component.html',
  styleUrls: ['./cases-details.component.scss']
})
export class CasesDetailsComponent implements OnInit {
name:any;
 
  isLoadingResults = true;
  address: any;
  gender: any;
  city: any;
  cases:any;
  country: any;
  status: any;
  age: any;

  constructor(private activatedRoute: ActivatedRoute,private afs: AngularFirestore,private route: ActivatedRoute, private api: ApiService, private router: Router) {


  
   }

   getCasesDetails(name: string) {
    this.afs.collection('CoronavirusCases', ref => ref.where('name','==', name )).valueChanges()
      .subscribe((res: any) => {
        console.log('my res', res);
        this.cases =res[0];
          this.isLoadingResults = false;
        });
  }

  deleteCases(id: any) {
    this.isLoadingResults = true;
    this.api.deleteCases(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          this.router.navigate(['/cases']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(extras => {
      this.name= extras.name
     
  });
  this.getCasesDetails(this.name);

}
}

