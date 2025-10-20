import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientViewComponent } from './components/client-view/client-view.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AppListComponent } from './components/app-list/app-list.component';
import { ServerListComponent } from './components/server-list/server-list.component';

// Directives
import { CpfMaskDirective } from './directives/cpf-mask.directive';
import { PhoneMaskDirective } from './directives/phone-mask.directive';

// Services
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { SidebarService } from './services/sidebar.service';
import { ClientFilterService } from './services/client-filter.service';
import { ClientSortService } from './services/client-sort.service';

// Pipes
import { CpfPipe } from './pipes/cpf.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { DateBrPipe } from './pipes/date-br.pipe';

// Guards
import { AuthGuard } from './guards/auth.guard';


const firebaseConfig = {
  apiKey: "AIzaSyDpTyQxGsNPwV7W7zvYuEk5c9eAYmbRc9c",
  authDomain: "tv-house-app-tst.firebaseapp.com",
  databaseURL: "https://tv-house-app-tst-default-rtdb.firebaseio.com",
  projectId: "tv-house-app-tst",
  storageBucket: "tv-house-app-tst.firebasestorage.app",
  messagingSenderId: "394838271920",
  appId: "1:394838271920:web:f8a69ed450ed424e4a9875"
};

@NgModule({
  declarations: [
    AppComponent,
    ClientListComponent,
    ClientFormComponent,
    ClientViewComponent,
    LoginComponent,
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    CpfMaskDirective,
    PhoneMaskDirective,
    CpfPipe,
    PhonePipe,
    DateBrPipe,
    AppListComponent,
    ServerListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    FirebaseService,
    AuthService,
    ThemeService,
    SidebarService,
    ClientFilterService,
    ClientSortService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
