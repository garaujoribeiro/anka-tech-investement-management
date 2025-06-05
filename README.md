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
- **Next.js 15** - Framework React com App Router
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
- Controle de quantidades e valores

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
```

### 3. Execute com Docker
```bash
# Subir todos os serviços
npm run docker:up
```

### 4. Configurar o banco de dados
```bash
# Executar migrações do Prisma
npm run db:migrate
# Executar o seeding do banco
npm run db:seed
```

### Scripts disponíveis

- `npm run docker:up` - Sobe a aplicação e builda
- `npm run db:migrate` - Executa as migrations do banco de dados
- `npm run db:seed` - Executa o seeding do banco de dados
- `npm run db:studio` - Abrir Prisma Studio

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

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

**Desenvolvedor**: Gabriel Ribeiro 
**Email**: garaujoribeirodev@gmail.com.com  
**LinkedIn**: [Seu LinkedIn]([https://linkedin.com/in/seuperfil](https://www.linkedin.com/in/garaujoribeiro/))

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela no repositório!**
