import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as jspdf from 'jspdf'
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js"
import { QuestionnaireService } from './services/questionnaire.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';

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

  @ViewChild('existsDialog') existsDialog: TemplateRef<any>;
  @ViewChild('submitDialog') submitDialog: TemplateRef<any>;
  @ViewChild('failDialog') failDialog: TemplateRef<any>;
  title = 'entrisec-booking';
  bookingForm: FormGroup;
  disableSelect = new FormControl(false);
  created_code = null;
  isShow = false;
  nDate:any;
  questionnaire: any;
  value = 0;
  loading = false;

  elementType: 'url' | 'img' | 'canvas' = 'canvas';

  todays_date:any;
  visitor_number:any;

  constructor(public service: QuestionnaireService, private dialog: MatDialog, public loadingCtrl: LoadingController, public alertCtrl: AlertController) { }

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

  checkForQuestionnaire(){
    if(this.service.form.valid){
      this.service.getValidQuestionnaire(this.service.form.value.employee_id)
       .subscribe(res => {
      this.questionnaire = res;
      console.log(this.questionnaire);
        if(this.questionnaire.length > 0){
          this.exists();
        }else{
          this.submit();
        }
      }, err => {
        console.log(err);
      });
    }
  }

  async exists() {
    this.dialog.open(this.existsDialog);
  }

  async submit() {
    this.dialog.open(this.submitDialog);
  }

  loadContent() {
    this.loading = true;
    const subs$: Subscription = interval(200).subscribe(res => {
      this.value = this.value + 10;
      if(this.value === 150) {
        subs$.unsubscribe();
        this.loading = false;
        this.value = 0;
        this.showBadge();
        this.dialog.closeAll();
      }
    });
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async onSubmit(){
    await this.service.submit(this.service.form.value).subscribe();
    await this.loadContent();
  }

  showBadge(){
    if(this.service.form.valid){
      this.service.getValidQuestionnaire(this.service.form.value.employee_id)
       .subscribe(res => {
      this.questionnaire = res;
      console.log(this.questionnaire);
        if(this.questionnaire.length > 0){
          this.displayBadge();
        }

        if(this.questionnaire.length == 0 ){
          this.notSubmitted();
        }
      }, err => {
        console.log(err);
      });
    }
  }

  async notSubmitted() {
    this.dialog.open(this.failDialog);
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
