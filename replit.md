# Overview

This is a full-stack scheduling system MVP built with React, Express, and TypeScript. The application provides client registration and authentication functionality with a modern UI built using shadcn/ui components. It's designed as a multi-tenant system where each client gets their own dedicated instance.

The system currently supports user authentication and client management with plans to expand into a comprehensive scheduling platform. The architecture follows a monorepo structure with shared schemas and clear separation between client and server code.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

**Janeiro 2025:**
- ✓ Implementado sistema de menu principal com sidebar lateral
- ✓ Criada página de dashboard com agendamentos do dia
- ✓ Adicionadas páginas de Agendamentos, Clientes, Financeiro e Configurações
- ✓ Sistema de navegação entre seções funcionando
- ✓ Aplicada nova paleta de cores: #FFFFFF (fundo), #D9D9D9 (secundário), #284B63 (primário)
- ✓ Integração completa entre login e dashboard principal
- ✓ Adicionada nova guia "Serviços" no menu lateral
- ✓ Implementado sistema completo de cadastro e gerenciamento de serviços
- ✓ Criado schema de banco de dados para serviços (nome, descrição, duração, preço, status ativo)
- ✓ Adicionadas rotas da API para CRUD completo de serviços
- ✓ Interface completa com formulários, listagem e ações de editar/excluir serviços
- ✓ Expandido sistema de clientes com campos CPF/CNPJ e endereço completo
- ✓ Implementado sistema completo de agendamentos com calendário interativo
- ✓ Criado schema de banco de dados para agendamentos (cliente, serviço, data, hora, status)
- ✓ Adicionadas rotas da API para CRUD completo de agendamentos com validações
- ✓ Interface de agendamento com seleção de cliente, serviço, data e horário
- ✓ Sistema de validação de conflitos de horário e verificação de disponibilidade

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom brand colors and CSS variables
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Design System**: Custom brand colors (primary: #284B63, secondary: #D9D9D9, background: #FFFFFF)

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Validation**: Zod schemas shared between client and server
- **Storage**: Currently using in-memory storage with interface for easy database migration
- **Development**: Custom Vite integration for hot module replacement

## Data Storage
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with migrations support
- **Schema**: Shared TypeScript schemas using drizzle-zod for validation
- **Tables**: Users (authentication) and Clients (customer management)

## Authentication & Authorization
- **Method**: Simple username/password authentication
- **Storage**: Session-based (prepared for JWT token implementation)
- **Validation**: Zod schemas for login and registration data
- **Default User**: Admin user (admin/admin123) for testing

## API Design
- **Pattern**: RESTful API with Express.js
- **Endpoints**: 
  - POST /api/auth/login (authentication)
  - GET /api/clients (list clients)
  - POST /api/clients (create client)
  - PUT /api/clients/:id (update client)
  - DELETE /api/clients/:id (delete client)
- **Error Handling**: Centralized error middleware with consistent JSON responses
- **Logging**: Request/response logging for API endpoints

## Development Tools
- **Build**: Vite for frontend, esbuild for backend
- **TypeScript**: Strict configuration with path mapping
- **Linting**: ESLint and TypeScript compiler checks
- **Database**: Drizzle Kit for migrations and schema management

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **drizzle-orm**: TypeScript ORM for database operations
- **express**: Web application framework for Node.js
- **react**: Frontend library for building user interfaces
- **vite**: Build tool and development server

## UI Component Libraries
- **@radix-ui/react-***: Comprehensive set of unstyled, accessible UI primitives
- **@tanstack/react-query**: Data fetching and caching library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating type-safe CSS class variants

## Form & Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Validation resolver for react-hook-form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

## Development & Build Tools
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **drizzle-kit**: CLI tools for Drizzle ORM migrations
- **@replit/vite-plugin-***: Replit-specific development plugins

## Routing & Navigation
- **wouter**: Minimalist routing library for React applications

## Date & Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **clsx**: Utility for constructing className strings conditionally
- **cmdk**: Command menu component for React