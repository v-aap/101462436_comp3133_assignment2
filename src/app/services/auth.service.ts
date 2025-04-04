import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user';
import { LOGIN, SIGNUP } from '../graphql/graphql.operations';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private apollo: Apollo) { }

  login(email: string, password: string): Observable<User> {
    return this.apollo.query<any>({
      query: LOGIN,
      variables: { email, password }
    }).pipe(
      map(result => {
        const user = result.data.login;
        this.setSession(user);
        return user;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.message || 'Login failed'));
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<User> {
    return this.apollo.mutate<any>({
      mutation: SIGNUP,
      variables: { username, email, password }
    }).pipe(
      map(result => {
        const user = result.data.signup;
        this.setSession(user);
        return user;
      }),
      catchError(error => {
        console.error('Signup error:', error);
        return throwError(() => new Error(error.message || 'Signup failed'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private setSession(user: User): void {
    // In a real app, the backend would return a token
    // Here we're just storing the user object as a simple way to track authentication
    localStorage.setItem(this.TOKEN_KEY, 'dummy-token-' + Date.now());
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}