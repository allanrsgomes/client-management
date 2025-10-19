// src/app/models/client.model.ts

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  uf: string;
  complement?: string; // Opcional
  coordinates?: Coordinates; // Opcional
}

export interface Credential {
  username: string;
  password: string;
}

export interface Client {
  id?: string;
  name: string;
  cpf: string;
  phone: string;
  address: Address; // Obrigatório mas pode ter campos vazios
  app: string[];
  server: string[];
  credentials: Credential[];
  cost: number;
  price: number;
  paid: boolean;
  paymentMethod: string;
  point: number;
  recommendation?: string; // Opcional
  observations?: string; // Opcional
  createdAt: string;
  date?: string; // Opcional
  archivedAt?: string; // Opcional
  archived: boolean;
  macs?: string[]; // Opcional
  mac?: string; // Opcional
}
