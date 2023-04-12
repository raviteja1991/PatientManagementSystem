import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Patients } from '../Models/Patients';
import configurl from '../../assets/config/config.json'

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  url = configurl.apiServer.url + '/api/Patients/';
  constructor(private http: HttpClient) { }

  getPatientsDetails(): Observable<Patients[]> {
    return this.http.get<Patients[]>(this.url + 'PatientsDetail');
  }

  getPatientDetailsById(patientID: number): Observable<Patients> {
    return this.http.get<Patients>(this.url + 'PatientDetails/' + patientID);
  }

  postPatientData(patientData: Patients): Observable<Patients> {
    const httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Patients>(this.url + 'CreatePatient', patientData, httpHeaders);
  }
  
  updatePatient(tempPatient: Patients, patient: Patients): Observable<Patients> {
    const httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Patients>(this.url + 'UpdatePatient/' + tempPatient.patientID, patient, httpHeaders);
  }

  deletePatientById(patientID: number): Observable<number> {
    const httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + 'DeletePatient/' + patientID);
  }
}
