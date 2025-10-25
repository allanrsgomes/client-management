import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientViewComponent } from './components/client-view/client-view.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AppListComponent } from './components/app-list/app-list.component';
import { ServerListComponent } from './components/server-list/server-list.component';
import { CpfMaskDirective } from './directives/cpf-mask.directive';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { MacMaskDirective } from './directives/mac-mask.directive';
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { SidebarService } from './services/sidebar.service';
import { ClientFilterService } from './services/client-filter.service';
import { ClientSortService } from './services/client-sort.service';
import { CpfPipe } from './pipes/cpf.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { DateBrPipe } from './pipes/date-br.pipe';
import { AuthGuard } from './guards/auth.guard';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from './components/shared/input-dialog/input-dialog.component';

const firebaseConfig = {
  apiKey: "AIzaSyBQleq2pB6djL2pJT9Mc88-1jwL275MC0A",
  authDomain: "tv-house-app.firebaseapp.com",
  databaseURL: "https://tv-house-app-default-rtdb.firebaseio.com",
  projectId: "tv-house-app",
  storageBucket: "tv-house-app.appspot.com",
  messagingSenderId: "640698621720",
  appId: "1:640698621720:web:3340c3e60df1e21a9e486d"
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
    MacMaskDirective,
    CpfPipe,
    PhonePipe,
    DateBrPipe,
    AppListComponent,
    ServerListComponent,
    ConfirmDialogComponent,
    InputDialogComponent,

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
    AngularFireAuthModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
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
