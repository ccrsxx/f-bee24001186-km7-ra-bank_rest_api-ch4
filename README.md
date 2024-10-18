# Simple Bank Rest API

## Rest API Documentation

The API documentation can be found [here](https://www.postman.com/soratan/workspace/challenge-4) on Postman.

## Development

Here are the steps to run the project locally.

1. Clone the repository

   ```bash
   git clone https://github.com/ccrsxx/f-bee24001186-km7-ra-bank_rest_api-ch4.git
   ```

1. Change directory to the project

   ```bash
   cd f-bee24001186-km7-ra-bank_rest_api-ch4
   ```

1. Install dependencies

   ```bash
   npm i
   ```

1. Create a copy of the `.env.example` file and name it `.env.local`. Make sure to fill the credentials correctly.

   ```bash
   cp .env.example .env.local
   ```

1. Create DB if not exists

   ```bash
   npm run db:create
   ```

1. Run migrations

   ```bash
   npm run db:migrate
   ```

1. Run the app

   ```bash
   npm run dev
   ```

1. Optional. You can run Prisma Studio to see the data in the database directly on the browser

   ```bash
   npm run db:studio
   ```
