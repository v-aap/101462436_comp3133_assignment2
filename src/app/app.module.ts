import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { GraphQLModule } from './graphql/graphql.module';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    GraphQLModule
  ],
  providers: [
    Apollo
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }