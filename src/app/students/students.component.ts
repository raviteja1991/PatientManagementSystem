import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { StudentService } from '../students/student.service';
import { Students } from '../Models/Students';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers:[DatePipe]
})
export class StudentsComponent {

  StudentsList?: Observable<Students[]>;
  StudentsListOne?: Observable<Students[]>;
  studentForm: any;
  studentId = 0;

  constructor(private formbulider: FormBuilder, private studentService: StudentService, private router: Router,
    private jwtHelper: JwtHelperService, private toastr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit() {
    const newStudent = new Students();
    this.studentForm = this.formbulider.group({
      studentFirstName: ['', [Validators.required]],
      studentLastName: ['', [Validators.required]],
      studentDateOfBirth: ['', [Validators.required]],
      studentGender: ['', [Validators.required]],
      studentAddress: ['', [Validators.required]],
      studentPhoneNumber: ['', [Validators.required]],
      studentEmailAddress: ['', [Validators.required]],
    });
    this.getStudentDetails();
  }

  getStudentDetails() {
    this.StudentsListOne = this.studentService.getStudentsDetails();
    this.StudentsList = this.StudentsListOne;
    this.StudentsList.subscribe(data => {
      if (data && data.length > 0) {
        console.log('myObservable has data:', data);
      } else {
        console.log('myObservable is empty');
      }
    });
  }

  getStudentObjectValues(student: Students){
    const newStudent = new Students();
    newStudent.firstName = this.studentForm.get('studentFirstName').value;
    newStudent.lastName = this.studentForm.get('studentLastName').value;
    newStudent.dob = this.studentForm.get('studentDateOfBirth').value;
    newStudent.gender = this.studentForm.get('studentGender').value;
    newStudent.studentAddress = this.studentForm.get('studentAddress').value;
    newStudent.phoneNumber = this.studentForm.get('studentPhoneNumber').value;
    newStudent.emailAddress = this.studentForm.get('studentEmailAddress').value;
    return newStudent;
  }

  PostStudent(student: Students) {
    const newStudent = this.getStudentObjectValues(student);
    this.studentService.postStudentData(newStudent).subscribe(
      () => {
        this.getStudentDetails();
        this.studentForm.reset();
        this.toastr.success('Data Saved Successfully');
      }
    );
  }

  StudentDetailsToEdit(id: number) {
    this.studentService.getStudentDetailsById(id).subscribe(studentsResult => {
      this.studentId = studentsResult.studentID;
      this.studentForm.controls['studentFirstName'].setValue(studentsResult.firstName);
      this.studentForm.controls['studentLastName'].setValue(studentsResult.lastName);
      const formattedDate = this.datePipe.transform(studentsResult.dob, 'yyyy-MM-dd');
      this.studentForm.controls['studentDateOfBirth'].setValue(formattedDate);
      this.studentForm.controls['studentGender'].setValue(studentsResult.gender);
      this.studentForm.controls['studentAddress'].setValue(studentsResult.studentAddress);
      this.studentForm.controls['studentPhoneNumber'].setValue(studentsResult.phoneNumber);
      this.studentForm.controls['studentEmailAddress'].setValue(studentsResult.emailAddress);
    });
  }

  UpdateStudent(student: Students) {
    student.studentID = this.studentId;
    const student_Master = this.studentForm.value;
    const newStudent = this.getStudentObjectValues(student);
    this.studentService.updateStudent(student_Master, newStudent).subscribe(() => {
      this.toastr.success('Data Updated Successfully');
      this.studentForm.reset();
      this.getStudentDetails();
    });
  }

  DeleteStudent(id: number) {
    if (confirm('Do you want to delete this student?')) {
      this.studentService.deleteStudentById(id).subscribe(() => {
        this.toastr.success('Data Deleted Successfully');
        this.getStudentDetails();
      });
    }
  }

  Clear(student: Students) {
    this.studentForm.reset();
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