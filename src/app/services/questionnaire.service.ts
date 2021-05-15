import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  url = environment.url;

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  submit(credentials) {
    return this.http.post(`${this.url}/api/questionnaire/add`, credentials);
  }

  getAllQuestionnaires(): Observable<any> {
    return this.http.get(`${this.url}/api/questionnaires`).pipe(
      map(this.extractData),
    );
  }

  getValidQuestionnaire(id){
    return this.http.get(`${this.url}/api/questionnaire/valid/${id}`, id);
  }

  form: FormGroup = new FormGroup({
    _id: new FormControl(null),
    personType: new FormControl(''),
    approved: new FormControl(false),
    employee_id: new FormControl(''),
    temperature: new FormControl(null),
    location: new FormControl(''),
    fourteen_days: new FormControl(false),
    leave: new FormControl(false),
    travel: new FormControl(false),
    business: new FormControl(false),
    contact: new FormControl(false),
    tested: new FormControl(''),
    testType: new FormControl(''),
    result: new FormControl(''),
    verifiedby: new FormControl(''),
    verificationDate: new FormControl(''),
    hotBody: new FormControl(''),
    headache: new FormControl(''),
    weak: new FormControl(''),
    bodyPains: new FormControl(''),
    nausea: new FormControl(''),
    vomiting: new FormControl(''),
    soreThroat: new FormControl(''),
    cough: new FormControl(''),
    nose: new FormControl(''),
    chestPains: new FormControl(''),
    breathing: new FormControl(''),
    duration: new FormControl(''),
    __v: new FormControl(null),
  });

  initializeFormGroup() {
    this.form.setValue({
      _id: null,
      personType: '',
      approved: false,
      employee_id: '',
      temperature: null,
      location: '',
      fourteen_days: false,
      leave: false,
      travel: false,
      business: false,
      contact: false,
      tested: '',
      testType: '',
      result: '',
      verifiedby: '',
      verificationDate: '',
      hotBody: '',
      headache: '',
      weak: '',
      bodyPains: '',
      nausea: '',
      vomiting: '',
      soreThroat: '',
      cough: '',
      nose: '',
      chestPains: '',
      breathing: '',
      duration: '',
      __v: null,
    });
  }

}
