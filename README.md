## Votex Project README

### English Version

### Project Setup

Welcome to the Votex project! Follow the steps below to set up and run the project.

#### Prerequisites
- Node.js and npm should be installed on your system.

#### Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd votex
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy the `.env.example` file to `.env`:
     ```sh
     cp .env.example .env
     ```
   - Fill in the required data in the `.env` file.

4. **Generate Prisma client:**
   ```sh
   npx prisma generate
   ```

5. **Run database migrations:**
   ```sh
   npx prisma migrate dev --name init
   ```

6. **Optional: Open Prisma Studio to check the database:**
   ```sh
   npx prisma studio
   ```

#### Running the Project

1. **Run the development server:**
   ```sh
   npm run dev
   ```

2. **Run the backend server:**
   ```sh
   node server.js
   ```

#### Future Updates
- Implement in-page chat functionality.
- Track which users are online on the vote page.
- Allow users to send invitations to vote pages.
- Enable sharing of links to vote pages with viewer or editor permissions.
- Add additional pages for blogs and media content.
- Provide tutorials and active presentation guides during registration.

### Russian Version

### Настройка проекта

Добро пожаловать в проект Votex! Следуйте инструкциям ниже, чтобы настроить и запустить проект.

#### Необходимые условия
- Node.js и npm должны быть установлены на вашей системе.

#### Установка

1. **Клонирование репозитория:**
   ```sh
   git clone <repository-url>
   cd votex
   ```

2. **Установка зависимостей:**
   ```sh
   npm install
   ```

3. **Настройка переменных окружения:**
   - Скопируйте файл `.env.example` в `.env`:
     ```sh
     cp .env.example .env
     ```
   - Заполните необходимые данные в файле `.env`.

4. **Опционально для новой пустой базы данных:Генерация клиента Prisma:**
   ```sh
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Опционально: Откройте Prisma Studio для проверки базы данных:**
   ```sh
   npx prisma studio
   ```

#### Запуск проекта

1. **Запуск сервера разработки:**
   ```sh
   npm run dev
   ```

2. **Запуск backend-сервера:**
   ```sh
   node server.js
   ```

#### Будущие обновления
- Внедрение функциональности чата на странице голосования.
- Отслеживание онлайн-статуса пользователей на странице голосования.
- Возможность отправки приглашений на страницы голосования.
- Возможность делиться ссылками на страницы голосования с правами просмотра или редактирования.
- Добавление дополнительных страниц для блогов и медиа-контента.
- Предоставление учебных материалов и руководств при регистрации.

```plaintext
# URL for connecting to the PostgreSQL database. Replace 'username', 'yourpassword', and other placeholders with your actual database credentials.
DATABASE_URL="postgresql://username:yourpassword@localhost:5432/Votex?schema=public"

# Secret key used for signing JWT tokens. Replace 'your-secret-key' with your own secret key.
JWT_SECRET=your-secret-key

# Port number on which the server will run.
PORT=5000

# PostgreSQL database user. Replace 'yourusername' with your actual database username.
PG_USER=yourusername

# Host address of the PostgreSQL database. Usually 'localhost' for local development.
PG_HOST=localhost

# Name of the PostgreSQL database. Replace 'Votex' if your database name is different.
PG_DATABASE=Votex

# PostgreSQL database password. Replace 'yourpassword' with your actual database password.
PG_PASSWORD=yourpassword

# Port number on which the PostgreSQL database is running. Default is typically 5432, but here it is set to 5000.
PG_PORT=5000

# Base URL for the API. This is the address your frontend will use to make API requests.
API_URL=http://localhost:5000

# A secret key for additional security purposes. Replace 'your_secret_key' with your own secret key.
SECRET_KEY=your_secret_key
```

Make sure to replace all the placeholders with your actual data before using this `.env` file.