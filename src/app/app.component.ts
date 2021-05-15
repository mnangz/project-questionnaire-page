import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as jspdf from 'jspdf'
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js"
import { QuestionnaireService } from './services/questionnaire.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(2000)
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  title = 'entrisec-booking';
  bookingForm: FormGroup;
  disableSelect = new FormControl(false);
  created_code = null;
  isShow = false;
  nDate:any;
  questionnaire: any;

  elementType: 'url' | 'img' | 'canvas' = 'canvas';

  todays_date:any;
  visitor_number:any;

  constructor(public service: QuestionnaireService) { }

  ngOnInit() {

    var min = Math.ceil(1000);
    var max = Math.floor(9999);
    var randNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const getDate = new Date().toLocaleDateString('en-US', {year: '2-digit', month: '2-digit', day: '2-digit'});
    const getYear = getDate.replace('/', '');
    this.todays_date = getYear.replace('/', '');
    this.visitor_number = `VP${this.todays_date}${randNumber}`;

    this.nDate = new Date;

  }

  onFail(){
    if(confirm('This Questionnaire was not saved')){
      return;
      // let currentUrl = this.router.url;
      // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      // this.router.onSameUrlNavigation = 'reload';
      // this.router.navigate([currentUrl]);
    }
  }

  checkForQuestionnaire(){
    if(this.service.form.valid){
      this.service.getValidQuestionnaire(this.service.form.value.employee_id)
       .subscribe(res => {
      this.questionnaire = res;
      console.log(this.questionnaire);
        if(this.questionnaire.length > 0){
          this.displayBadge();
        }
      }, err => {
        console.log(err);
      });
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async onSubmit(){
    await this.service.submit(this.service.form.value).subscribe();
    await this.delay(2000);
    this.checkForQuestionnaire();
    //this.onClear();
  }

  displayBadge(){
    this.toggleDisplay();
    this.created_code = this.service.form.value.employee_id;

    this.service.form.reset();
    this.service.initializeFormGroup();
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  onClear(){
    this.service.form.reset();
    this.service.initializeFormGroup();
  }

  formateDate(visitors_date: Date) {

    let theDate = visitors_date.getDate() + "/" + (visitors_date.getMonth() + 1) + "/" + visitors_date.getFullYear();
    return theDate;
  }

  download(){

    var element = document.getElementById('badge');
    console.log(element);
    var opt = {
      margin:       1,
      filename:     `Questionnaire-${this.formateDate(this.nDate)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 5, scrollY: -40, allowTaint: true, y: -100 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();

  }
}
