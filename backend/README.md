# Anti-Fraud Transaction System

An application that processes financial transactions and validates them through an anti-fraud service using Kafka.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose** (for Kafka and Postgres)
- **NPM** (Node Package Manager)

## Setup & Installation

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the backend folder**:
    ```bash
    cd backend
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Running the Application

Follow these steps in order:

### 1. Start Infrastructure
Start the Database (Postgres) and Message Broker (Kafka) using Docker:

```bash
docker-compose up -d
```
*Wait a minute for the containers to fully start.*

### 2. Start the Services
You need to run the **Transactions** API and **Anti-Fraud** service in separate terminals.

**Terminal 1: Transactions API**
```bash
npm run start:dev transactions
```

**Terminal 2: Anti-Fraud Service**
```bash
npm run start:dev anti-fraud
```

## How to Test

The system allows you to create transactions that are automatically Validated:
*   **Approved**: Value is **1000 or less**.
*   **Rejected**: Value is **greater than 1000**.

### JSON Request Body (for Postman)
Use this JSON payload for `POST http://localhost:3000/transactions`:

```json
{
  "accountExternalIdDebit": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "accountExternalIdCredit": "82747195-257a-4d1a-be3b-7901748f0852",
  "transferTypeId": 1,
  "value": 500
}
```

### Using PowerShell
You can copy-paste this command to create a transaction:

```powershell
$body = @{
  accountExternalIdDebit = "d290f1ee-6c54-4b01-90e6-d701748f0851"
  accountExternalIdCredit = "82747195-257a-4d1a-be3b-7901748f0852"
  transferTypeId = 1
  value = 500
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/transactions" -Method Post -Body $body -ContentType "application/json"
```

### Check Status
To see the status of all transactions:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/transactions" -Method Get
```
