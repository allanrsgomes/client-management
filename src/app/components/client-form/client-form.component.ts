// src/app/components/client-form/client-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { CustomValidators } from '../../validators/custom-validators';
import { StringUtils } from '../../utils/string.utils';
import { DateUtils } from '../../utils/date.utils';
import { App } from '../../models/app.model';
import { Server } from '../../models/server.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  isEditMode = false;
  clientId: string | null = null;
  loading = false;

  // Listas dinâmicas carregadas do Firebase
  apps: string[] = [];
  servers: string[] = [];
  apps$!: Observable<App[]>;
  servers$!: Observable<Server[]>;

  paymentMethods = ['Pix', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Transferência'];
  ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAppsAndServers();

    this.clientId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.clientId;

    if (this.isEditMode && this.clientId) {
      this.loadClient(this.clientId);
    }
  }

  loadAppsAndServers(): void {
    // Carrega apps ativos do Firebase
    this.firebaseService.getActiveApps().subscribe({
      next: (apps) => {
        this.apps = apps.map(app => app.name);
        console.log('Apps carregados:', this.apps);
      },
      error: (error) => {
        console.error('Erro ao carregar apps:', error);
        this.apps = [];
      }
    });

    // Carrega servidores ativos do Firebase
    this.servers$ = this.firebaseService.getActiveServers();
    this.servers$.subscribe(servers => {
      this.servers = servers.map(server => server.name);
    });
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, CustomValidators.cpf()]],
      phone: ['', [Validators.required, CustomValidators.phone()]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        uf: ['', Validators.required],
        complement: [''],
        coordinates: this.fb.group({
          lat: [0],
          lng: [0]
        })
      }),
      app: [[], Validators.required],
      server: [[], Validators.required],
      credentials: this.fb.array([]),
      cost: [0, [Validators.required, CustomValidators.minValue(0)]],
      price: [0, [Validators.required, CustomValidators.minValue(0)]],
      paid: [false],
      paymentMethod: ['Pix'],
      point: [0, CustomValidators.minValue(0)],
      recommendation: [''],
      observations: [''],
      createdAt: [DateUtils.getCurrentISODate()],
      date: [''],
      archived: [false],
      archivedAt: [''],
      macs: [[]],
      mac: [''],
    });
  }

  get credentials(): FormArray {
    return this.clientForm.get('credentials') as FormArray;
  }

  addCredential(): void {
    const credentialGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.credentials.push(credentialGroup);
  }

  removeCredential(index: number): void {
    this.credentials.removeAt(index);
  }

  loadClient(id: string): void {
    this.loading = true;
    this.firebaseService.getClient(id).subscribe({
      next: (client) => {
        if (client) {
          const clientData = {
            ...client,
            date: DateUtils.toInputFormat(client.date),
            createdAt: DateUtils.toInputFormat(client.createdAt)
          };

          this.clientForm.patchValue(clientData);

          if (client.credentials && client.credentials.length > 0) {
            client.credentials.forEach(cred => {
              const credGroup = this.fb.group({
                username: [cred.username, Validators.required],
                password: [cred.password, Validators.required]
              });
              this.credentials.push(credGroup);
            });
          }
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cliente:', error);
        this.loading = false;
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.clientForm.valid) {
      this.loading = true;
      const formData = this.clientForm.value;

      const clientData = {
        ...formData,
        cpf: StringUtils.onlyNumbers(formData.cpf),
        phone: StringUtils.onlyNumbers(formData.phone),
        date: formData.date ? DateUtils.toISOString(formData.date) : '',
        createdAt: this.isEditMode ? formData.createdAt : DateUtils.getCurrentISODate(),
        archivedAt: formData.archived && !this.isEditMode ? DateUtils.getCurrentISODate() : formData.archivedAt
      };

      try {
        if (this.isEditMode && this.clientId) {
          await this.firebaseService.updateClient(this.clientId, clientData);
          alert('Cliente atualizado com sucesso!');
        } else {
          await this.firebaseService.createClient(clientData);
          alert('Cliente criado com sucesso!');
        }
        this.router.navigate(['/clients']);
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        alert('Erro ao salvar cliente. Tente novamente.');
      } finally {
        this.loading = false;
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      this.markFormGroupTouched(this.clientForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/clients']);
  }

  onAppChange(event: any, app: string): void {
    const apps = this.clientForm.get('app')?.value || [];
    if (event.target.checked) {
      if (!apps.includes(app)) {
        apps.push(app);
      }
    } else {
      const index = apps.indexOf(app);
      if (index > -1) {
        apps.splice(index, 1);
      }
    }
    this.clientForm.patchValue({ app: apps });
  }

  onServerChange(event: any, server: string): void {
    const servers = this.clientForm.get('server')?.value || [];
    if (event.target.checked) {
      if (!servers.includes(server)) {
        servers.push(server);
      }
    } else {
      const index = servers.indexOf(server);
      if (index > -1) {
        servers.splice(index, 1);
      }
    }
    this.clientForm.patchValue({ server: servers });
  }
}
