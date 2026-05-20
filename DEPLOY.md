## 📦 Guia de Implantação - Lista de Tarefas MVC

### ✅ Pré-requisitos
- **Node.js** (versão 14+)
- **MySQL** (versão 5.7+)
- **Git** (opcional)

---

## 🚀 Passo 1: Clonar ou Baixar o Projeto

```bash
# Se estiver usando Git
git clone <URL_DO_REPOSITORIO>
cd mvc-tarefas-3c-paginacao

# Ou descompacte a pasta se foi baixada como ZIP
```

---

## 2️⃣ Passo 2: Instalar Dependências

```bash
npm install
```

Isso instalará todas as dependências listadas em `package.json`:
- express
- express-validator
- ejs
- mysql2
- moment
- dotenv

---

## 3️⃣ Passo 3: Criar Banco de Dados no MySQL

### Opção A: Usando MySQL Workbench
1. Abra **MySQL Workbench**
2. Faça login na sua instância MySQL
3. Vá em **File → Open SQL Script**
4. Selecione o arquivo: `config/script_bd.sql`
5. Clique em **Execute** (⚡ ou Ctrl+Shift+Enter)

### Opção B: Usando Command Line
```bash
# Windows
mysql -u root -p < config/script_bd.sql

# macOS/Linux
mysql -u root -p < config/script_bd.sql
```

Quando solicitado, entre sua senha MySQL.

---

## 4️⃣ Passo 4: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env` (copie do `.env.example`)

2. Abra o arquivo `.env` e configure com seus dados:

```env
APP_PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_DATABASE=lista-tarefas
DB_PORT=3306
```

**Valores padrão:**
- `DB_HOST`: localhost (ou seu IP/servidor)
- `DB_USER`: root (ou seu usuário MySQL)
- `DB_PASSWORD`: sua senha do MySQL
- `DB_DATABASE`: lista-tarefas (não mudar, é o nome criado pelo script)
- `DB_PORT`: 3306 (porta padrão MySQL)

---

## 5️⃣ Passo 5: Iniciar a Aplicação

```bash
# Iniciar servidor
node app.js
```

Você verá:
```
Servidor ouvindo na porta 3000
http://localhost:3000

Conectado ao SGBD!
```

---

## 6️⃣ Passo 6: Acessar a Aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

---

## 📋 Estrutura do Banco de Dados

**Tabela: `tarefas`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_tarefa` | INT (PK) | ID único da tarefa |
| `nome_tarefa` | VARCHAR(45) | Nome/descrição da tarefa |
| `prazo_tarefa` | DATE | Data de prazo |
| `situacao_tarefa` | INT | Situação (0-5) |
| `status_tarefa` | INT | Status (1=ativa, 0=cancelada, 5=escondida) |

**Situações:**
- 0 = Cancelada
- 1 = Pendente (ativa)
- 2 = Iniciada
- 3 = Finalizada
- 4 = Em Atraso
- 5 = Escondida

---

## 🔧 Solução de Problemas

### ❌ Erro: "ECONNREFUSED - Connection refused"
**Solução:** MySQL não está rodando
```bash
# Windows - Iniciar MySQL
net start MySQL80

# macOS - com Homebrew
brew services start mysql

# Linux
sudo systemctl start mysql
```

### ❌ Erro: "Access denied for user 'root'@'localhost'"
**Solução:** Senha do MySQL incorreta no `.env`
```env
DB_PASSWORD=sua_senha_correta
```

### ❌ Erro: "Unknown database 'lista-tarefas'"
**Solução:** Script SQL não foi executado
- Execute novamente: `mysql -u root -p < config/script_bd.sql`

### ❌ Erro: "Cannot find module 'express'"
**Solução:** Dependências não instaladas
```bash
npm install
```

---

## 📚 Recursos Úteis

- [Documentação Express.js](https://expressjs.com/)
- [Documentação EJS](https://ejs.co/)
- [Documentação mysql2](https://github.com/sidorares/node-mysql2)
- [Documentação express-validator](https://express-validator.github.io/docs/)

---

## 🚀 Deploy (Produção)

Para implantar em produção (servidor):

1. **Crie um arquivo `.env` no servidor** com credenciais do banco remoto
2. **Use um gerenciador de processos** como PM2:
   ```bash
   npm install -g pm2
   pm2 start app.js --name "tarefas-app"
   ```
3. **Configure um proxy reverso** (Nginx ou Apache)
4. **Configure HTTPS/SSL**

---

## 📞 Suporte

Se tiver dúvidas, consulte:
- Os arquivos em `config/`
- Os comentários no código
- A documentação das dependências
