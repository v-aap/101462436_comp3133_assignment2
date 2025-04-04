import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-details',
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
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId!: string;
  employee: Employee | null = null;
  employeeForm!: FormGroup;
  loading = false;
  errorMessage = '';
  isEditing = false;
  selectedFileName = '';
  selectedFile: File | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.employeeId) {
      this.router.navigate(['/employees']);
      return;
    }

    this.initForm();
    this.loadEmployeeDetails();
  }

  initForm(): void {
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
    
    // Disable form initially since we're in view mode
    this.employeeForm.disable();
  }

  loadEmployeeDetails(): void {
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        this.employee = employee;
        
        // Convert date string to Date object for date picker
        const dateOfJoining = employee.date_of_joining ? new Date(employee.date_of_joining) : null;
        
        this.employeeForm.patchValue({
          ...employee,
          date_of_joining: dateOfJoining
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading employee details: ' + error.message, 'Close', {
          duration: 3000
        });
        this.router.navigate(['/employees']);
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing) {
      this.employeeForm.enable();
    } else {
      this.employeeForm.disable();
      // Reset form to original values
      if (this.employee) {
        const dateOfJoining = this.employee.date_of_joining ? new Date(this.employee.date_of_joining) : null;
        this.employeeForm.patchValue({
          ...this.employee,
          date_of_joining: dateOfJoining
        });
      }
    }
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

    this.employeeService.updateEmployee(this.employeeId, formValues).subscribe({
      next: (updatedEmployee) => {
        this.employee = updatedEmployee;
        this.isEditing = false;
        this.employeeForm.disable();
        this.snackBar.open('Employee updated successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to update employee. Please try again.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}