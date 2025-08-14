import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertServiceSchema, insertAppointmentSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ 
          message: "Usuário ou senha inválidos" 
        });
      }
      
      // In a real application, you would generate and return a JWT token
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username },
        message: "Login realizado com sucesso"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Client management endpoints
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar clientes" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      
      // Check if email already exists
      const existingClient = await storage.getClientByEmail(clientData.email);
      if (existingClient) {
        return res.status(400).json({ 
          message: "E-mail já cadastrado no sistema" 
        });
      }
      
      const client = await storage.createClient(clientData);
      res.status(201).json({
        success: true,
        client,
        message: "Cliente cadastrado com sucesso"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar cliente" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const clientData = insertClientSchema.partial().parse(req.body);
      
      // If email is being updated, check if it's already in use
      if (clientData.email) {
        const existingClient = await storage.getClientByEmail(clientData.email);
        if (existingClient && existingClient.id !== req.params.id) {
          return res.status(400).json({ 
            message: "E-mail já cadastrado no sistema" 
          });
        }
      }
      
      const updatedClient = await storage.updateClient(req.params.id, clientData);
      if (!updatedClient) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      res.json({
        success: true,
        client: updatedClient,
        message: "Cliente atualizado com sucesso"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClient(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      res.json({
        success: true,
        message: "Cliente excluído com sucesso"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir cliente" });
    }
  });

  // Service management endpoints
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar serviços" });
    }
  });

  app.get("/api/services/active", async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar serviços ativos" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      
      const service = await storage.createService(serviceData);
      res.status(201).json({
        success: true,
        service,
        message: "Serviço cadastrado com sucesso"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar serviço" });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    try {
      const serviceData = insertServiceSchema.partial().parse(req.body);
      
      const updatedService = await storage.updateService(req.params.id, serviceData);
      if (!updatedService) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }
      
      res.json({
        success: true,
        service: updatedService,
        message: "Serviço atualizado com sucesso"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteService(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }
      
      res.json({
        success: true,
        message: "Serviço excluído com sucesso"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir serviço" });
    }
  });

  // Appointment management endpoints
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar agendamentos" });
    }
  });

  app.get("/api/appointments/date/:date", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByDate(req.params.date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar agendamentos por data" });
    }
  });

  app.get("/api/appointments/client/:clientId", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByClient(req.params.clientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar agendamentos do cliente" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      
      // Verificar se cliente existe
      const client = await storage.getClient(appointmentData.client_id);
      if (!client) {
        return res.status(400).json({ 
          message: "Cliente não encontrado" 
        });
      }

      // Verificar se serviço existe e está ativo
      const service = await storage.getService(appointmentData.service_id);
      if (!service) {
        return res.status(400).json({ 
          message: "Serviço não encontrado" 
        });
      }
      if (service.active !== "true") {
        return res.status(400).json({ 
          message: "Serviço não está ativo" 
        });
      }

      // Verificar se já existe agendamento no mesmo horário
      const existingAppointments = await storage.getAppointmentsByDate(appointmentData.date);
      const conflictingAppointment = existingAppointments.find(
        apt => apt.time === appointmentData.time && apt.status !== "cancelado"
      );
      
      if (conflictingAppointment) {
        return res.status(400).json({ 
          message: "Já existe um agendamento neste horário" 
        });
      }
      
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json({
        success: true,
        appointment,
        message: "Agendamento criado com sucesso"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar agendamento" });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      
      // Se está alterando o horário, verificar conflitos
      if (appointmentData.date && appointmentData.time) {
        const existingAppointments = await storage.getAppointmentsByDate(appointmentData.date);
        const conflictingAppointment = existingAppointments.find(
          apt => apt.time === appointmentData.time && 
                 apt.status !== "cancelado" && 
                 apt.id !== req.params.id
        );
        
        if (conflictingAppointment) {
          return res.status(400).json({ 
            message: "Já existe um agendamento neste horário" 
          });
        }
      }
      
      const updatedAppointment = await storage.updateAppointment(req.params.id, appointmentData);
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      
      res.json({
        success: true,
        appointment: updatedAppointment,
        message: "Agendamento atualizado com sucesso"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAppointment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      
      res.json({
        success: true,
        message: "Agendamento excluído com sucesso"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir agendamento" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
