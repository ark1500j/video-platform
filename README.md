# Video-Platform 
This is a Next.js application that uses Prisma for database management. This README provides instructions for setting up, running the application, and using Prisma.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Prisma](#prisma)
  - [Generating Prisma Client](#generating-prisma-client)
  - [Running Migrations](#running-migrations)
- [Running the Application](#running-the-application)
- [Scripts](#scripts)
- [License](#license)

## Getting Started

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v18.x or higher)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/ark1500j/Video-Platform.git
cd Video-Platform
npm install
```
Or if you prefer yarn:
```bash
git clone https://github.com/ark1500j/Video-Platform.git
cd Video-Platform
yarn install
```
#.env
```bash
# Connect to database.
DATABASE_URL="postgresql://*..."


# Add any other environment variables you might need
MAIL_SERVICE=*
MAIL_USER=*
MAIL_PASSWORD=*
JWT_SECRET=*
UPLOADTHING_SECRET=*
UPLOADTHING_APP_ID=*
```
##Prisma
#Generating Prisma Client
After setting up your environment variables, generate the Prisma client by running:
```bash
npx prisma migrate dev --name init
```
Or with yarn:
```bash
yarn prisma migrate dev --name init
```
This command will apply any pending migrations and update your database schema.

#Running the Application
To start the development server:

```bash
npm run dev
```
Or with yarn:
```bash
yarn dev
```
This will start the application on http://localhost:3000.
#Scripts
Here are some useful scripts for development and production:

-dev: Starts the development server.
-build: Builds the application for production.
-start: Starts the production server.
-prisma:generate: Generates Prisma client.
-prisma:migrate: Applies database migrations.
You can run these scripts with npm or yarn:
```bash
npm run <script>
```
```bash
yarn <script>
```
#License
This project is licensed under the MIT License. See the LICENSE file for details.
```bash
Make sure to replace `your-username` and `your-repo` with the actual username and repository name. Additionally, customize any other sections as needed for your specific project.
```