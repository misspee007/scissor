# SnipIt

SnipIt is a URL shortener application that allows users to generate short, customized URLs for their long URLs. It provides a simple and efficient way to manage and track URLs by providing analytics and QR code generation features.

## Features

- URL shortening: Generate short and customized URLs for long URLs.
- QR code generation: Create QR codes for shortened URLs.
- User management: Users can register, log in, and manage their shortened URLs.
- Analytics: Track the number of clicks and referers for shortened URLs.
- Caching: Utilizes caching to improve performance and reduce server load.
- Rate limiting: Prevents abuse by limiting the number of requests per user.

## Technologies Used

- [Nest.js](https://github.com/nestjs/nest): A progressive Node.js framework for building efficient and scalable server-side applications.
- [Prisma](https://www.prisma.io): A modern database toolkit for TypeScript and Node.js.
- [PostgreSQL](https://www.postgresql.org): An open-source relational database management system.
- NestJS Cache Manager: A module that provides caching capabilities for Nest.js applications.
- Throttler Module: A module for request rate limiting in Nest.js applications.

## Quick Start

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `yarn install`
3. Set up the database connection in the `.env` file (see `.env.example`).
4. Generate prisma client: `yarn run prisma:generate`
5. Run database migrations: `yarn run prisma:migrate`
6. Start the application: `yarn run start:dev`

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## API Documentation

The API documentation is available at `<base-url>/docs` after starting the application. It provides detailed information about the available endpoints, request/response structures, and authentication requirements.

## Configuration

The app's configuration is managed using environment variables. The required variables can be set in the `.env` file at the root of the project. Refer to the `.env.example` file for the list of required variables.

<!-- ## License

This project is licensed under the [MIT License](LICENSE). -->


## Stay in touch

- Author - Precious Abubakar
- Mail - [preciousdanabubakar@gmailcom](mailto:preciousdanabubakar@gmailcom)
- LinkedIn - [linkedin.com/in/precious-abubakar](https://linkedin.com/in/precious-abubakar)
- Medium - [@preciousdanabubakar](https://medium.com/@preciousdanabubakar)
- Hashnode - [@PDA](https://hashnode.com/@PDA)
- Dev.to - [@pda](https://dev.to/pda)