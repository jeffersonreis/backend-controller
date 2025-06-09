# Sistema de Controle de Acesso - Backend

Backend em [NestJS](https://nestjs.com/) com TypeORM e SQLite, responsável pela autenticação, cadastro de usuários, controle de veículos, registro de acessos e upload de imagens, desenvolvido para um Trabalho de Conclusão de Curso (TCC).

## Principais Funcionalidades

- Autenticação JWT (usuário e admin)
- Cadastro, edição e exclusão de usuários (admin)
- Cadastro, edição e exclusão de veículos (usuário)
- Upload de imagem para veículos e registros de acesso (Cloudinary)
- Registro de histórico de acessos por veículo, com foto opcional
- Histórico de acesso filtrado por usuário ou geral (admin)
- Rotas protegidas por autenticação e permissões (roles)
- Integração com ESP8266 para abertura de portão (API REST)
- Seed automático de usuário admin padrão

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [SQLite](https://www.sqlite.org/)
- [Cloudinary](https://cloudinary.com/) (upload de imagens)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (hash de senhas)
- [Passport](http://www.passportjs.org/) (JWT & auth)

# Como rodar o projeto

## Instale as dependências:
```bash
npm install
```

## Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```bash
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Rode o servidor
```bash
npm run start:dev
```

### O backend ficará disponível em:
```bash
http://localhost:3000/api
```

## Endpoints Principais

- **POST `/api/auth/login`**  
  Login e geração do JWT

- **GET `/api/users`**  
  Listagem de usuários (admin)

- **POST `/api/users`**  
  Cadastro de usuário (admin)

- **PATCH `/api/users/:id`**  
  Editar usuário (admin)

- **DELETE `/api/users/:id`**  
  Excluir usuário (admin)

- **GET `/api/vehicles`**  
  Listar veículos do usuário logado

- **POST `/api/vehicles`**  
  Cadastrar novo veículo

- **PATCH `/api/vehicles/:id`**  
  Editar veículo

- **DELETE `/api/vehicles/:id`**  
  Excluir veículo

- **POST `/api/vehicles/:id/upload-image`**  
  Adicionar imagem ao veículo

- **GET `/api/access-history`**  
  Histórico geral de acessos (admin)

- **GET `/api/access-history/my`**  
  Histórico do usuário logado

- **POST `/api/access-history/log`**  
  Registrar novo acesso com upload de imagem

- **GET `/api/gate/command`**  
  Consulta de comando de abertura de portão (ESP8266)

- **POST `/api/gate/command`**  
  Define comando de abertura do portão


## Observações
- Ao iniciar o projeto, um usuário administrador padrão (`admin`/`admin`) é criado automaticamente caso não exista.
- O backend utiliza SQLite como banco de dados padrão, facilitando testes e implantação rápida.
- As imagens enviadas são armazenadas no Cloudinary.
- Todas as rotas, exceto `/auth/login`, são protegidas por autenticação JWT e controle de permissões (roles).

# Estrutura de Pastas
```
src/
  auth/             # Módulo de autenticação (JWT, guards, estratégias)
  users/            # Módulo de usuários (CRUD, roles)
  vehicles/         # Módulo de veículos (CRUD, upload de imagem)
  access-history/   # Módulo de registro e histórico de acessos
  gate/             # Módulo de integração com ESP8266 (portão)
  cloudinary/       # Módulo de integração com Cloudinary (upload)
  database/         # Configuração e seed do banco de dados
  app.module.ts     # Módulo principal da aplicação
  main.ts           # Ponto de entrada da aplicação
```

# Licença
Uso acadêmico. Projeto desenvolvido para fins de TCC.

