import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../validators/custom-validators';
import { DateUtils } from '../../utils/date.utils';
import { parsePhoneNumber } from 'libphonenumber-js';

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
  apps: string[] = [];
  servers: string[] = [];

  // Opções de pontos
  pointOptions = [1, 2, 3, 4, 5, 6];

  // Tabela de preços por ponto
  private priceTable: { [key: number]: number } = {
    1: 44.90,
    2: 34.90,
    3: 29.90,
    4: 29.90,
    5: 29.90,
    6: 29.90
  };

  paymentMethods = ['Pix', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Transferência'];
  ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
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

    // Observa mudanças no campo de pontos
    this.clientForm.get('point')?.valueChanges.subscribe(points => {
      this.updatePricePerPoint(points);
    });
  }

  loadAppsAndServers(): void {
    this.firebaseService.getActiveApps().subscribe({
      next: (apps) => {
        this.apps = apps.map(app => app.name);
        console.log('Apps carregados:', this.apps);
      },
      error: (error) => {
        console.error('Erro ao carregar apps:', error);
        this.notificationService.error('Erro ao carregar lista de apps.');
        this.apps = [];
      }
    });

    this.firebaseService.getActiveServers().subscribe({
      next: (servers) => {
        this.servers = servers.map(server => server.name);
        console.log('Servidores carregados:', this.servers);
      },
      error: (error) => {
        console.error('Erro ao carregar servidores:', error);
        this.notificationService.error('Erro ao carregar lista de servidores.');
        this.servers = [];
      }
    });
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [CustomValidators.cpf()]],
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
      macs: this.fb.array([]),
      cost: [0, [Validators.required, CustomValidators.minValue(0)]],
      price: [44.90, [Validators.required, CustomValidators.minValue(0)]], // Agora é preço POR PONTO
      paid: [false],
      paymentMethod: ['Pix'],
      point: [1, [Validators.required, CustomValidators.minValue(1)]],
      recommendation: [''],
      observations: [''],
      createdAt: [DateUtils.getCurrentISODate()],
      date: [''],
      archived: [false],
      archivedAt: [''],
      mac: [''],
    });
  }

  /**
   * Retorna apenas o código do país detectado (ex: "BR", "US", "PT")
   * Para exibir na label do campo de telefone
   */
  getDetectedCountry(): string | null {
    const phoneValue = this.clientForm.get('phone')?.value;
    if (!phoneValue || phoneValue.length < 3) return null;

    try {
      const numbersOnly = phoneValue.replace(/\D/g, '');
      if (numbersOnly.length < 8) return null;

      const phoneWithPlus = '+' + numbersOnly;
      const phoneNumber = parsePhoneNumber(phoneWithPlus);

      if (phoneNumber.isValid() && phoneNumber.country) {
        return phoneNumber.country;
      }
    } catch (error) {
      // Ignora erros de parse
    }

    return null;
  }

  /**
   * Atualiza o preço por ponto baseado na quantidade selecionada
   */
  updatePricePerPoint(points: number): void {
    if (!points || points < 1) return;

    const pricePerPoint = this.priceTable[points] || this.priceTable[4];

    // Atualiza o campo de preço com o valor POR PONTO
    this.clientForm.patchValue({
      price: parseFloat(pricePerPoint.toFixed(2))
    }, { emitEvent: false });
  }

  /**
   * Retorna o preço por ponto baseado na quantidade
   */
  getPricePerPoint(points: number): number {
    return this.priceTable[points] || this.priceTable[4];
  }

  /**
   * Calcula e retorna o valor total (pontos × preço por ponto)
   * Usado apenas para exibição visual
   */
  getTotalPrice(): number {
    const points = this.clientForm.get('point')?.value || 0;
    const pricePerPoint = this.clientForm.get('price')?.value || 0;
    return points * pricePerPoint;
  }

  /**
   * Retorna texto descritivo do cálculo
   */
  getPriceDescription(): string {
    const points = this.clientForm.get('point')?.value || 0;
    const pricePerPoint = this.clientForm.get('price')?.value || 0;
    const total = this.getTotalPrice();

    if (!points || points < 1) return '';

    return `${points} ponto(s) × R$ ${pricePerPoint.toFixed(2)} = R$ ${total.toFixed(2)}`;
  }

  get credentials(): FormArray {
    return this.clientForm.get('credentials') as FormArray;
  }

  get macs(): FormArray {
    return this.clientForm.get('macs') as FormArray;
  }

  addCredential(): void {
    const credentialGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.credentials.push(credentialGroup);
  }

  removeCredential(index: number): void {
    this.notificationService.confirm(
      'Remover Credencial',
      'Deseja realmente remover esta credencial?',
      'Remover',
      'Cancelar',
      'warning'
    ).subscribe(confirmed => {
      if (confirmed) {
        this.credentials.removeAt(index);
        this.notificationService.success('Credencial removida!');
      }
    });
  }

  addMac(): void {
    const macGroup = this.fb.group({
      address: ['', [Validators.required, Validators.pattern(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i)]]
    });
    this.macs.push(macGroup);
  }

  removeMac(index: number): void {
    this.notificationService.confirm(
      'Remover MAC Address',
      'Deseja realmente remover este MAC address?',
      'Remover',
      'Cancelar',
      'warning'
    ).subscribe(confirmed => {
      if (confirmed) {
        this.macs.removeAt(index);
        this.notificationService.success('MAC address removido!');
      }
    });
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

          if (client.macs && client.macs.length > 0) {
            client.macs.forEach((mac: any) => {
              const macAddress = typeof mac === 'string' ? mac : (mac.address || '');
              const macGroup = this.fb.group({
                address: [macAddress, [Validators.required, Validators.pattern(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i)]]
              });
              this.macs.push(macGroup);
            });
          }
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cliente:', error);
        this.notificationService.error('Erro ao carregar dados do cliente.');
        this.loading = false;
        this.router.navigate(['/clients']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.clientForm.valid) {
      this.loading = true;
      const formData = this.clientForm.value;
      const macsArray = formData.macs?.map((mac: any) => mac.address) || [];

      // Remove formatação do CPF (salva apenas números)
      const cpfNumbersOnly = formData.cpf ? formData.cpf.replace(/\D/g, '') : '';

      // Remove formatação do telefone (salva apenas números)
      const phoneNumbersOnly = formData.phone.replace(/\D/g, '');

      const clientData = {
        ...formData,
        cpf: cpfNumbersOnly,           // Apenas números: 12345678901
        phone: phoneNumbersOnly,        // Apenas números: 5548988591509
        price: formData.price,          // Preço POR PONTO (ex: 44.90)
        date: formData.date ? DateUtils.toISOString(formData.date) : '',
        createdAt: this.isEditMode ? formData.createdAt : DateUtils.getCurrentISODate(),
        archivedAt: formData.archived && !this.isEditMode ? DateUtils.getCurrentISODate() : formData.archivedAt,
        macs: macsArray
      };

      try {
        if (this.isEditMode && this.clientId) {
          await this.firebaseService.updateClient(this.clientId, clientData);
          this.notificationService.success('Cliente atualizado com sucesso!');
        } else {
          await this.firebaseService.createClient(clientData);
          this.notificationService.success('Cliente criado com sucesso!');
        }
        this.router.navigate(['/clients']);
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        this.notificationService.error('Erro ao salvar cliente. Tente novamente.');
      } finally {
        this.loading = false;
      }
    } else {
      this.notificationService.warning('Por favor, preencha todos os campos obrigatórios corretamente.');
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
    if (this.clientForm.dirty) {
      this.notificationService.confirm(
        'Cancelar Edição',
        'Você tem alterações não salvas. Deseja realmente cancelar?',
        'Sim, cancelar',
        'Continuar editando',
        'warning'
      ).subscribe(confirmed => {
        if (confirmed) {
          this.router.navigate(['/clients']);
        }
      });
    } else {
      this.router.navigate(['/clients']);
    }
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
