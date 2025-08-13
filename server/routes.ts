import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, loginSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
