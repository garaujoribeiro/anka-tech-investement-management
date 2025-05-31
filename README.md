# 💼 Sistema de Gestão de Investimentos

Um sistema completo para gerenciamento de clientes e visualização de ativos financeiros, desenvolvido com **TypeScript**, **Docker** e as melhores práticas de desenvolvimento.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **Fastify** - Framework web rápido e eficiente
- **Prisma ORM** - Modelagem e manipulação do banco de dados
- **MySQL 8.0** - Banco de dados relacional
- **Zod** - Validação de schemas e tipos
- **TypeScript** - Tipagem estática

### Frontend
- **Next.js 14** - Framework React com App Router
- **React Query** - Gerenciamento de estado server-side
- **React Hook Form + Zod** - Formulários com validação
- **ShadCN/UI** - Componentes de interface modernos
- **Tailwind CSS** - Estilização utilitária
- **Axios** - Cliente HTTP

### Infraestrutura
- **Docker Compose** - Orquestração de containers
- **MySQL** - Banco de dados em container

## 📋 Funcionalidades

### ✅ Gestão de Clientes
- Cadastro de novos clientes
- Listagem de todos os clientes
- Edição de informações dos clientes
- Controle de status (Ativo/Inativo)

### 📊 Gestão de Ativos
- Visualização de ativos financeiros disponíveis
- Alocação de ativos por cliente
- Controle de quantidades e valores

### 🔧 Recursos Técnicos
- **API RESTful** completa
- **Validação** rigorosa de dados
- **Containerização** completa
- **Hot reload** para desenvolvimento
- **Tipagem TypeScript** end-to-end

## 🏗️ Estrutura do Projeto

```
investment-management/
├── backend/                 # API Fastify + Prisma
│   ├── src/
│   │   ├── controllers/     # Controladores das rotas
│   │   ├── routes/          # Definição das rotas
│   │   ├── schemas/         # Validações Zod
│   │   ├── services/        # Lógica de negócio
│   │   └── server.ts        # Servidor principal
│   ├── prisma/              # Schema e migrações
│   └── Dockerfile
├── frontend/                # Aplicação Next.js
│   ├── src/
│   │   ├── app/             # App Router (Next.js 13+)
│   │   ├── components/      # Componentes React
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilitários e configurações
│   └── Dockerfile
├── docker-compose.yml       # Orquestração dos serviços
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- **Docker** e **Docker Compose** instalados
- **Node.js 18+** (para desenvolvimento local)

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd investment-management
```

### 2. Configure as variáveis de ambiente
```bash
# Copie os arquivos de exemplo
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

### 3. Execute com Docker
```bash
# Subir todos os serviços
docker-compose up -d

# Ou subir com logs visíveis
docker-compose up
```

### 4. Configurar o banco de dados
```bash
# Executar migrações do Prisma
docker-compose exec backend npm run db:migrate
```

## 🌐 Acessos

Após executar o projeto:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Banco MySQL**: localhost:3306
  - Usuário: `investment_user`
  - Senha: `investment_pass_123`
  - Database: `investment_db`

## 🔧 Comandos Úteis

### Docker Compose
```bash
# Subir apenas o banco de dados
docker-compose up db

# Ver logs de um serviço específico
docker-compose logs backend
docker-compose logs frontend

# Parar todos os serviços
docker-compose down

# Rebuild das imagens
docker-compose up --build
```

### Prisma (Database)
```bash
# Gerar cliente Prisma
docker-compose exec backend npm run db:generate

# Executar migrações
docker-compose exec backend npm run db:migrate

# Abrir Prisma Studio
docker-compose exec backend npm run db:studio

# Reset do banco (CUIDADO!)
docker-compose exec backend npm run db:reset
```

### Desenvolvimento Local
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📊 API Endpoints

### Clientes
```http
GET    /api/clients           # Listar todos os clientes
POST   /api/clients           # Criar novo cliente
GET    /api/clients/:id       # Buscar cliente por ID
PUT    /api/clients/:id       # Atualizar cliente
DELETE /api/clients/:id       # Remover cliente
```

### Ativos
```http
GET    /api/assets            # Listar todos os ativos
GET    /api/clients/:id/allocations  # Alocações de um cliente
POST   /api/allocations       # Criar nova alocação
```

## 🔍 Exemplos de Uso

### Criar Cliente
```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "status": "ACTIVE"
  }'
```

### Listar Clientes
```bash
curl http://localhost:3001/api/clients
```

## 🛠️ Desenvolvimento

### Instalação para desenvolvimento local
```bash
# Backend
cd backend
npm install
npm run db:generate
npm run dev

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

### Scripts disponíveis

**Backend:**
- `npm run dev` - Servidor em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run db:migrate` - Executar migrações
- `npm run db:studio` - Abrir Prisma Studio

**Frontend:**
- `npm run dev` - Desenvolvimento local
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção

## 🚨 Troubleshooting

### Problemas comuns

**Erro de conexão com banco:**
```bash
# Verificar se o MySQL está rodando
docker-compose ps

# Verificar logs do banco
docker-compose logs db
```

**Erro no Prisma:**
```bash
# Regenerar cliente Prisma
docker-compose exec backend npm run db:generate

# Verificar conexão
docker-compose exec backend npx prisma db push
```

**Porta já em uso:**
```bash
# Verificar processos usando as portas
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :3306  # MySQL
```

## 📝 TODO / Próximas Funcionalidades

- [ ] Autenticação de usuários
- [ ] Dashboard com gráficos
- [ ] Importação de dados via CSV
- [ ] Relatórios em PDF
- [ ] API de cotações em tempo real
- [ ] Notificações por email
- [ ] Testes automatizados

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

**Desenvolvedor**: Seu Nome  
**Email**: seuemail@exemplo.com  
**LinkedIn**: [Seu LinkedIn](https://linkedin.com/in/seuperfil)

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela no repositório!**