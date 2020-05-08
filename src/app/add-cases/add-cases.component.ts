import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AngularFirestore } from '@angular/fire//firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage} from '@angular/fire/storage';
import 'firebase/firestore';
import * as firebase from 'firebase/app';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-add-cases',
  templateUrl: './add-cases.component.html',
  styleUrls: ['./add-cases.component.scss']
})
export class AddCasesComponent implements OnInit {
  casesForm: FormGroup;
  name = '';
  gender = '';
  age: number = null;
  address = '';
  city = '';
  country = '';
  status = '';
  ndat:any;
  lent:any=0;

  statusList = ['Positive', 'Dead', 'Recovered'];
  genderList = ['Male', 'Female'];
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  constructor(private afs: AngularFirestore, private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.afs.collection('CoronavirusCases').valueChanges().subscribe(data => {
    
      console.log('my data',data); 
      this.ndat= data;
  
  this.lent=this.ndat.length;
  console.log('my lenthyyyyy1',this.lent);
  
  });
    this.casesForm = this.formBuilder.group({
      name : [null, Validators.required],
      gender : [null, Validators.required],
      age : [null, Validators.required],
      address : [null, Validators.required],
      city : [null, Validators.required],
      country : [null, Validators.required],
      status : [null, Validators.required]
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    
    this.afs.collection('CoronavirusCases').doc(`case ${this.lent+1}`)
      .set({
        name:this.casesForm.value.name,
        gender:this.casesForm.value.gender,
        age:this.casesForm.value.age,
        address:this.casesForm.value.address,
        city:this.casesForm.value.city,
        country:this.casesForm.value.country,
        status:this.casesForm.value.status
      }).then(()=>{
        //this.router.navigate(['/cases']);
        this.isLoadingResults = false;
      });
  }

}
