import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NgIf
  ],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  errorMessage = '';
  selectedFileName = '';
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      
      // Read file as data URL for preview or base64 encoding
      const reader = new FileReader();
      reader.onload = () => {
        // Store base64 string in form
        this.employeeForm.patchValue({
          employee_photo: reader.result as string
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Format date as ISO string
    const formValues = { ...this.employeeForm.value };
    if (formValues.date_of_joining instanceof Date) {
      formValues.date_of_joining = formValues.date_of_joining.toISOString();
    }

    this.employeeService.addEmployee(formValues).subscribe({
      next: () => {
        this.snackBar.open('Employee added successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to add employee. Please try again.';
        this.loading = false;
      }
    });
  }
}