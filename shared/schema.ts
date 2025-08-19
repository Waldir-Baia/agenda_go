import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  cpf_cnpj: text("cpf_cnpj").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  observations: text("observations"),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  duration: numeric("duration").notNull(), // duração em minutos
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  active: text("active").notNull().default("true"), // "true" ou "false"
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  client_id: varchar("client_id").notNull(),
  service_id: varchar("service_id").notNull(),
  date: text("date").notNull(), // formato YYYY-MM-DD
  time: text("time").notNull(), // formato HH:MM
  status: text("status").notNull().default("pendente"), // "pendente", "confirmado", "cancelado", "concluido"
  observations: text("observations"),
  created_at: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "consumo", "venda", "uso"
  quantity: numeric("quantity").notNull().default("0"),
  min_quantity: numeric("min_quantity").notNull().default("5"), // estoque mínimo para alerta
  unit: text("unit").notNull(), // "unidade", "kg", "litro", "metro", etc.
  cost_price: numeric("cost_price", { precision: 10, scale: 2 }), // preço de custo
  sale_price: numeric("sale_price", { precision: 10, scale: 2 }), // preço de venda (se aplicável)
  supplier: text("supplier"), // fornecedor
  barcode: text("barcode"), // código de barras/EAN
  active: text("active").notNull().default("true"), // "true" ou "false"
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  cpf_cnpj: true,
  address: true,
  phone: true,
  email: true,
  observations: true,
}).extend({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf_cnpj: z.string().min(1, "CPF/CNPJ é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("E-mail deve ter um formato válido"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  duration: true,
  price: true,
  active: true,
}).extend({
  name: z.string().min(1, "Nome do serviço é obrigatório"),
  duration: z.string().min(1, "Duração é obrigatória"),
  price: z.string().min(1, "Preço é obrigatório"),
  active: z.string().default("true"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  client_id: true,
  service_id: true,
  date: true,
  time: true,
  status: true,
  observations: true,
}).extend({
  client_id: z.string().min(1, "Cliente é obrigatório"),
  service_id: z.string().min(1, "Serviço é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  status: z.string().default("pendente"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  category: true,
  quantity: true,
  min_quantity: true,
  unit: true,
  cost_price: true,
  sale_price: true,
  supplier: true,
  barcode: true,
  active: true,
}).extend({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  quantity: z.string().min(0, "Quantidade deve ser maior ou igual a 0"),
  min_quantity: z.string().min(0, "Quantidade mínima deve ser maior ou igual a 0"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  cost_price: z.string().optional(),
  sale_price: z.string().optional(),
  active: z.string().default("true"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
