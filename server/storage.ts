import { type User, type InsertUser, type Client, type InsertClient, type Service, type InsertService } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getClient(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
  
  getService(id: string): Promise<Service | undefined>;
  getAllServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private services: Map<string, Service>;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.services = new Map();
    
    // Create a default admin user for testing
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "admin123" // In production, this should be hashed
    };
    this.users.set(adminUser.id, adminUser);
    
    // Create some default services for testing
    const defaultServices: Service[] = [
      {
        id: randomUUID(),
        name: "Corte de Cabelo",
        description: "Corte tradicional masculino e feminino",
        duration: "45",
        price: "35.00",
        active: "true"
      },
      {
        id: randomUUID(),
        name: "Barba",
        description: "Aparar e modelar barba",
        duration: "30",
        price: "25.00",
        active: "true"
      },
      {
        id: randomUUID(),
        name: "Manicure",
        description: "Cuidados com as unhas das mãos",
        duration: "60",
        price: "20.00",
        active: "true"
      }
    ];
    
    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (client) => client.email === email,
    );
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = { 
      ...insertClient, 
      id,
      observations: insertClient.observations || null
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const existingClient = this.clients.get(id);
    if (!existingClient) {
      return undefined;
    }
    
    const updatedClient: Client = { ...existingClient, ...clientData };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getActiveServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      service => service.active === "true"
    );
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { 
      ...insertService, 
      id,
      description: insertService.description || null
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) {
      return undefined;
    }
    
    const updatedService: Service = { ...existingService, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }
}

export const storage = new MemStorage();
