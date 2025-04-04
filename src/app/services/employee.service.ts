import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Employee } from '../models/employee';
import {
  GET_ALL_EMPLOYEES,
  GET_EMPLOYEE_BY_ID,
  SEARCH_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE
} from '../graphql/graphql.operations';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private apollo: Apollo) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.query<any>({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'network-only' // Don't cache this query
    }).pipe(
      map(result => result.data.getAllEmployees),
      catchError(error => {
        console.error('Get all employees error:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch employees'));
      })
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.query<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.getEmployeeById),
      catchError(error => {
        console.error('Get employee by ID error:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch employee'));
      })
    );
  }

  searchEmployees(criteria: { designation?: string, department?: string }): Observable<Employee[]> {
    return this.apollo.query<any>({
      query: SEARCH_EMPLOYEES,
      variables: criteria,
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.searchEmployees),
      catchError(error => {
        console.error('Search employees error:', error);
        return throwError(() => new Error(error.message || 'Failed to search employees'));
      })
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.apollo.mutate<any>({
      mutation: ADD_EMPLOYEE,
      variables: employee,
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(
      map(result => result.data.addEmployee),
      catchError(error => {
        console.error('Add employee error:', error);
        return throwError(() => new Error(error.message || 'Failed to add employee'));
      })
    );
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.apollo.mutate<any>({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, ...employee },
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(
      map(result => result.data.updateEmployee),
      catchError(error => {
        console.error('Update employee error:', error);
        return throwError(() => new Error(error.message || 'Failed to update employee'));
      })
    );
  }

  deleteEmployee(id: string): Observable<Employee> {
    return this.apollo.mutate<any>({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(
      map(result => result.data.deleteEmployee),
      catchError(error => {
        console.error('Delete employee error:', error);
        return throwError(() => new Error(error.message || 'Failed to delete employee'));
      })
    );
  }
}