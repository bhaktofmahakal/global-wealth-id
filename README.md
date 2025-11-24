# Global Wealth ID Prototype

A full-stack app for converting credit scores between countries.

## Tech Stack
- Frontend: Next.js with React and TailwindCSS
- Backend: Node.js with Express
- Database: In-memory array

## Local Development

### Prerequisites
- Node.js 18+
- Docker (optional)

### Running Locally

1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs on http://localhost:3001

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs on http://localhost:3000

### Using Docker Compose
```bash
docker-compose up --build
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
npm start
```

## Azure Deployment

1. Build and push images:
   ```bash
   docker build -t yourregistry.azurecr.io/global-wealth-id-backend ./backend
   docker build -t yourregistry.azurecr.io/global-wealth-id-frontend ./frontend
   docker push yourregistry.azurecr.io/global-wealth-id-backend
   docker push yourregistry.azurecr.io/global-wealth-id-frontend
   ```

2. Create Azure Container Apps:
   - Backend: az containerapp create --name backend --resource-group rg --image yourregistry.azurecr.io/global-wealth-id-backend --target-port 3001 --ingress external --environment-variables PORT=3001
   - Frontend: az containerapp create --name frontend --resource-group rg --image yourregistry.azurecr.io/global-wealth-id-frontend --target-port 3000 --ingress external --environment-variables NEXT_PUBLIC_BACKEND_URL=https://backend-url

## Environment Variables
- `PORT`: Backend port (default 3001)
- `NEXT_PUBLIC_BACKEND_URL`: Frontend backend URL (default http://localhost:3001)