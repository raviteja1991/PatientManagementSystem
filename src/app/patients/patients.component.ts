import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PatientService } from '../patients/patient.service';
import { Patients } from '../Models/Patients';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent {

  PatientsList?: Observable<Patients[]>;
  PatientsListOne?: Observable<Patients[]>;
  patientForm: any;
  patientId = 0;

  constructor(private formbulider: FormBuilder, private patientService: PatientService, private router: Router,
    private jwtHelper: JwtHelperService, private toastr: ToastrService) { }

  ngOnInit() {
    const newPatient = new Patients();

    this.patientForm = this.formbulider.group({
      patientFirstName: ['', [Validators.required]],
      patientLastName: ['', [Validators.required]],
      patientFullName: ['', [Validators.required]],
      patientDateOfBirth: ['', [Validators.required]],
      patientGender: ['', [Validators.required]],
      patientAge: ['', [Validators.required]],
      patientAddress: ['', [Validators.required]],
      patientPhoneNumber: ['', [Validators.required]],
      patientEmailAddress: ['', [Validators.required]],
    });

    this.getPatientDetails();
  }

  getPatientDetails() {
    this.PatientsListOne = this.patientService.getPatientsDetails();
    this.PatientsList = this.PatientsListOne;

    this.PatientsList.subscribe(data => {
      if (data && data.length > 0) {
        console.log('myObservable has data:', data);
      } else {
        console.log('myObservable is empty');
      }
    });

  }

  getPatientObjectValues(patient: Patients){
    const newPatient = new Patients();
    newPatient.firstName = this.patientForm.get('patientFirstName').value;
    newPatient.lastName = this.patientForm.get('patientLastName').value;
    newPatient.fullName = this.patientForm.get('patientFullName').value;
    newPatient.dob = this.patientForm.get('patientDateOfBirth').value;
    newPatient.gender = this.patientForm.get('patientGender').value;
    newPatient.age = this.patientForm.get('patientAge').value;
    newPatient.patientAddress = this.patientForm.get('patientAddress').value;
    newPatient.phoneNumber = this.patientForm.get('patientPhoneNumber').value;
    newPatient.emailAddress = this.patientForm.get('patientEmailAddress').value;

    return newPatient;
  }

  PostPatient(patient: Patients) {
    const newPatient = this.getPatientObjectValues(patient);
    this.patientService.postPatientData(newPatient).subscribe(
      () => {
        this.getPatientDetails();
        this.patientForm.reset();
        this.toastr.success('Data Saved Successfully');
      }
    );
  }

  PatientDetailsToEdit(id: number) {
    this.patientService.getPatientDetailsById(id).subscribe(patientsResult => {
      this.patientId = patientsResult.patientID;
      this.patientForm.controls['patientFirstName'].setValue(patientsResult.firstName);
      this.patientForm.controls['patientLastName'].setValue(patientsResult.lastName);
      this.patientForm.controls['patientFullName'].setValue(patientsResult.fullName);
      this.patientForm.controls['patientDateOfBirth'].setValue(patientsResult.dob);
      this.patientForm.controls['patientGender'].setValue(patientsResult.gender);
      this.patientForm.controls['patientAge'].setValue(patientsResult.age);
      this.patientForm.controls['patientAddress'].setValue(patientsResult.patientAddress);
      this.patientForm.controls['patientPhoneNumber'].setValue(patientsResult.phoneNumber);
      this.patientForm.controls['patientEmailAddress'].setValue(patientsResult.emailAddress);
    });
  }

  UpdatePatient(patient: Patients) {
    patient.patientID = this.patientId;
    const patient_Master = this.patientForm.value;
    const newPatient = this.getPatientObjectValues(patient);
    this.patientService.updatePatient(patient_Master, newPatient).subscribe(() => {
      this.toastr.success('Data Updated Successfully');
      this.patientForm.reset();
      this.getPatientDetails();
    });
  }

  DeletePatient(id: number) {
    if (confirm('Do you want to delete this patient?')) {
      this.patientService.deletePatientById(id).subscribe(() => {
        this.toastr.success('Data Deleted Successfully');
        this.getPatientDetails();
      });
    }
  }

  Clear(patient: Patients) {
    this.patientForm.reset();
  }

  public logOut = () => {
    localStorage.removeItem("jwt");
    this.router.navigate([""]);
  }

  isUserAuthenticated() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }
}