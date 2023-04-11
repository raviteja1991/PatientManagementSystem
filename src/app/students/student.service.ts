import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Students } from '../Models/Students';
import configurl from '../../assets/config/config.json'

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  url = configurl.apiServer.url + '/api/Students/';
  constructor(private http: HttpClient) { }

  getStudentsDetails(): Observable<Students[]> {
    return this.http.get<Students[]>(this.url + 'StudentsDetail');
  }

  getStudentDetailsById(studentID: number): Observable<Students> {
    return this.http.get<Students>(this.url + 'StudentDetails/' + studentID);
  }

  postStudentData(studentData: Students): Observable<Students> {
    const httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Students>(this.url + 'CreateStudent', studentData, httpHeaders);
  }
  
  updateStudent(tempStudent: Students, student: Students): Observable<Students> {
    const httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Students>(this.url + 'UpdateStudent/' + tempStudent.studentID, student, httpHeaders);
  }

  deleteStudentById(studentID: number): Observable<number> {
    const httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + 'DeleteStudent/' + studentID);
  }
}
