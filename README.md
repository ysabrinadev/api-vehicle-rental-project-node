# Vehicle Rental Project API

API RESTful para um sistema de locação de veículos desenvolvida com Node.js, TypeScript, Express e MySQL.

## 🚀 Tecnologias

### Backend

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Express** - Framework web para Node.js
- **MySQL** - Banco de dados relacional
- **MySQL2** - Driver MySQL para Node.js

### Segurança

- **Helmet** - Middleware de segurança para HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Proteção contra ataques de força bruta
- **Joi** - Validação de dados
- **Dotenv** - Gerenciamento de variáveis de ambiente

### Logging e Monitoramento

- **Winston** - Sistema de logging
- **Morgan** - Middleware de logging HTTP

### Testes

- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP
- **ts-jest** - Suporte TypeScript para Jest

### Desenvolvimento

- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Nodemon** - Reinicialização automática em desenvolvimento
- **ts-node** - Execução TypeScript sem compilação prévia

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 8.0 ou superior)
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone [https://github.com/ysabrinadev/api-vehicle-rental-project-node.git]
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=vehicle_rental_database
DB_PORT=3306
```

4. Crie o banco de dados:

```sql
CREATE DATABASE IF NOT EXISTS vehicle_rental_database;

USE vehicle_rental_database;

CREATE TABLE IF NOT EXISTS vehicles (
  Id INT PRIMARY KEY AUTO_INCREMENT,
  Placa VARCHAR(7) NOT NULL,
  Chassi VARCHAR(17) NOT NULL,
  Renavam VARCHAR(11) NOT NULL,
  Modelo VARCHAR(100) NOT NULL,
  Ano INT NOT NULL,
  DataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  DataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 Executando o projeto

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## 📦 Estrutura do Projeto

```
src/
├── config/         # Configurações do projeto
├── controllers/    # Controladores da aplicação
│   └── __tests__/ # Testes dos controladores
├── interfaces/     # Interfaces TypeScript
├── middleware/     # Middlewares do Express
│   ├── __tests__/ # Testes dos middlewares
│   ├── errorHandler.ts
│   ├── logger.ts
│   ├── rateLimiter.ts
│   ├── security.ts
│   └── validator.ts
├── models/         # Modelos de dados
│   └── __tests__/ # Testes dos modelos
├── repositories/   # Camada de acesso a dados
│   └── __tests__/ # Testes dos repositórios
├── routes/         # Rotas da API
├── services/       # Serviços da aplicação
└── server.ts       # Arquivo principal
```

## 📡 Endpoints da API

### Veículos

- `GET /api/vehicles` - Lista todos os veículos
- `GET /api/vehicles/:id` - Obtém um veículo específico
- `POST /api/vehicles` - Cria um novo veículo
- `PUT /api/vehicles/:id` - Atualiza um veículo
- `DELETE /api/vehicles/:id` - Remove um veículo

## 🔒 Segurança

- **SQL Injection Prevention**: Todas as queries são parametrizadas
- **CORS**: Configurado para permitir apenas origens específicas
- **Rate Limiting**: Limite de requisições por IP
- **Security Headers**: Configurados via Helmet
- **Input Validation**: Validação de dados com Joi
- **Error Handling**: Tratamento centralizado de erros
- **Logging**: Logs estruturados com Winston e Morgan

## 🧪 Testes

- **Unit Tests**: Testes unitários com Jest
- **Integration Tests**: Testes de integração com Supertest
- **Test Coverage**: Relatório de cobertura de testes
- **Mocking**: Uso de mocks para isolamento de testes

## 🛠️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run build`: Compila o TypeScript para JavaScript
- `npm start`: Inicia o servidor em modo produção
- `npm test`: Executa os testes
- `npm run test:watch`: Executa os testes em modo watch
- `npm run test:coverage`: Gera relatório de cobertura de testes
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código com Prettier

## 📝 Padrões de Código

- **Arquitetura**: MVC com Repository Pattern
- **Tipagem**: TypeScript para tipagem estática
- **Assincronicidade**: Async/Await para operações assíncronas
- **Tratamento de Erros**: Middleware centralizado
- **Validação**: Schemas Joi para validação de dados
- **Logging**: Logs estruturados e rotacionados
- **Testes**: Cobertura de testes unitários e de integração

## ✒️ Autores

- **Sabrina Santos** - _Desenvolvimento_ - [https://github.com/ysabrinadev]
