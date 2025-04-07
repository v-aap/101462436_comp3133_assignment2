import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['photo', 'name', 'email', 'designation', 'department', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  searchForm: FormGroup;
  departments: string[] = [];
  designations: string[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private imageService: ImageService
  ) {
    this.searchForm = this.formBuilder.group({
      department: [''],
      designation: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.log('Image failed to load:', img.src);
    img.src = 'assets/placeholder.png';
  }
  
  getPhotoUrl(photoPath: string | undefined): string {
    return this.imageService.getEmployeePhotoUrl(photoPath);
  }

  extractUniqueValues(employees: Employee[]): void {
    // Extract unique departments and designations
    this.departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
    this.designations = [...new Set(employees.map(emp => emp.designation).filter(Boolean))];
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
      },
      error: (error) => {
        this.snackBar.open('Error loading employees: ' + error.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  searchEmployees(): void {
    const criteria = {
      department: this.searchForm.value.department || undefined,
      designation: this.searchForm.value.designation || undefined
    };

    // Only search if at least one criterion is provided
    if (criteria.department || criteria.designation) {
      this.employeeService.searchEmployees(criteria).subscribe({
        next: (employees) => {
          this.dataSource.data = employees;
        },
        error: (error) => {
          this.snackBar.open('Error searching employees: ' + error.message, 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      this.loadEmployees();
    }
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.loadEmployees();
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.snackBar.open('Employee deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadEmployees();
        },
        error: (error) => {
          this.snackBar.open('Error deleting employee: ' + error.message, 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}