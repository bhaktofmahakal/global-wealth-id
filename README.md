# Global Wealth ID — Credit Score Converter Prototype

**A full-stack mini-app that converts credit scores between different countries' scoring systems.**

- **Frontend:** Next.js 14 with React Server Components, TailwindCSS
- **Backend:** Node.js 18 + Express
- **Database:** In-memory array (mock data store)
- **Infrastructure:** Docker + docker-compose, Azure Container Apps ready

---

## 🎯 Project Overview

**Global Wealth ID** simulates a fintech credit score converter. Users input:
1. Their credit score (in Country A's scale)
2. Target country (Country B)
3. Optional user name

The app converts the score using a deterministic formula:
- Normalize input to 0–1 range
- Apply country-specific bias factor
- Denormalize to target country's range

Results are stored in-memory (last 10 conversions) and displayed in a "Recent Checks" feed.

---

## 📁 Project Structure

```
global-wealth-id/
├── frontend/                 # Next.js app
│   ├── app/
│   │   ├── page.js          # Home page (form + result)
│   │   ├── layout.js
│   │   └── globals.css
│   ├── components/
│   │   ├── ScoreForm.jsx     # Form component
│   │   ├── ConvertedResult.jsx
│   │   └── RecentChecks.jsx  # History display
│   ├── tests/
│   │   └── conversion.spec.js # Playwright E2E tests
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── playwright.config.js
│   └── package.json
│
├── backend/                  # Express app
│   ├── src/
│   │   ├── index.js          # Server entry
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── convert.js    # POST /api/convert
│   │   │   └── recent.js     # GET /api/recent
│   │   ├── services/
│   │   │   ├── convertService.js
│   │   │   └── recentChecksService.js
│   │   ├── middlewares/
│   │   │   └── validation.js
│   │   └── utils/
│   │       └── logger.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Multi-service orchestration
├── .dockerignore
├── vibes-log.md              # AI development journey
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ with npm
- **Docker** (optional, for containerized setup)
- **Git**

### Option 1: Local Development (Recommended for Dev)

**1. Start Backend:**
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:3001`

**2. Start Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

**3. Open browser:**
```
http://localhost:3000
```

---

### Option 2: Docker Compose (Recommended for Testing)

```bash
# From project root
docker-compose up --build
```

Access:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api/convert`

---

## 🔗 API Reference

### POST `/api/convert`

**Request:**
```json
{
  "score": 700,
  "fromCountry": "USA",
  "toCountry": "UK",
  "user": "John Doe"
}
```

**Response (200):**
```json
{
  "score": 700,
  "fromCountry": "USA",
  "toCountry": "UK",
  "convertedScore": 778,
  "timestamp": "2025-11-24T15:10:00Z",
  "user": "John Doe"
}
```

**Error (400):**
```json
{
  "error": "Invalid payload"
}
```

---

### GET `/api/recent`

**Response (200):**
```json
[
  {
    "score": 700,
    "convertedScore": 778,
    "fromCountry": "USA",
    "toCountry": "UK",
    "timestamp": "2025-11-24T15:10:00Z",
    "user": "John Doe"
  },
  ...
]
```

---

## 📝 Supported Countries

| Country | Min Score | Max Score |
|---------|-----------|-----------|
| USA     | 300       | 850       |
| UK      | 0         | 1000      |
| Germany | 0         | 1000      |
| Japan   | 100       | 900       |
| Australia | 0       | 1200      |

---

## 🧪 Testing

### Run Playwright E2E Tests

```bash
cd frontend
npm test
```

**Test Cases:**
- ✅ Form displays all fields
- ✅ Successful conversion shows result
- ✅ Multiple countries conversion works
- ✅ Optional user field handled
- ✅ Recent checks list displays
- ✅ Error handling & validation

**View test report:**
```bash
npx playwright show-report
```

---

## 🐳 Docker Build & Run

### Single Service Build

**Backend:**
```bash
cd backend
docker build -t global-wealth-id-backend .
docker run -p 3001:3001 global-wealth-id-backend
```

**Frontend:**
```bash
cd frontend
docker build -t global-wealth-id-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_BACKEND_URL=http://localhost:3001 global-wealth-id-frontend
```

### Multi-Service (Compose)

```bash
# From root
docker-compose up --build
```

Stop:
```bash
docker-compose down
```

---

## ☁️ Azure Container Apps Deployment

### 1. Prerequisites
```bash
# Install Azure CLI
# Log in
az login

# Set resource group, registry
export RESOURCE_GROUP="your-rg"
export REGISTRY_NAME="yourregistry"
export ACR_URL="$REGISTRY_NAME.azurecr.io"
```

### 2. Build & Push Images
```bash
# Build and push backend
docker build -f backend/Dockerfile -t $ACR_URL/global-wealth-id-backend:latest ./backend
docker push $ACR_URL/global-wealth-id-backend:latest

# Build and push frontend
docker build -f frontend/Dockerfile -t $ACR_URL/global-wealth-id-frontend:latest ./frontend
docker push $ACR_URL/global-wealth-id-frontend:latest
```

### 3. Create Container App Environment
```bash
az containerapp env create \
  --name gwid-env \
  --resource-group $RESOURCE_GROUP \
  --location eastus
```

### 4. Create Backend Container App
```bash
az containerapp create \
  --name global-wealth-id-backend \
  --resource-group $RESOURCE_GROUP \
  --environment gwid-env \
  --image $ACR_URL/global-wealth-id-backend:latest \
  --target-port 3001 \
  --ingress internal \
  --registry-server $ACR_URL \
  --env-vars PORT=3001
```

### 5. Create Frontend Container App
```bash
BACKEND_URL=$(az containerapp show \
  --name global-wealth-id-backend \
  --resource-group $RESOURCE_GROUP \
  --query "properties.configuration.ingress.fqdn" -o tsv)

az containerapp create \
  --name global-wealth-id-frontend \
  --resource-group $RESOURCE_GROUP \
  --environment gwid-env \
  --image $ACR_URL/global-wealth-id-frontend:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_URL \
  --env-vars NEXT_PUBLIC_BACKEND_URL="http://$BACKEND_URL"
```

### 6. Get Public URL
```bash
az containerapp show \
  --name global-wealth-id-frontend \
  --resource-group $RESOURCE_GROUP \
  --query "properties.configuration.ingress.fqdn" -o tsv
```

Access your app:
```
https://<your-fqdn>
```

---

## 🔐 Environment Variables

### Frontend
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:3001` | Backend API endpoint |

### Backend
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment mode |

---

## 📊 Conversion Formula

The app uses a **normalized mapping** approach:

```
1. Normalize input to [0, 1]:
   normalized = (input_score - from_min) / (from_max - from_min)

2. Clamp to valid range:
   normalized = Math.min(1, Math.max(0, normalized))

3. Apply country bias:
   biased = normalized * bias_factor

4. Denormalize to target range:
   output = Math.round(to_min + biased * (to_max - to_min))
```

**Example:**
- Input: USA score 700 → UK
- USA range: 300–850, UK range: 0–1000
- Normalized: (700 - 300) / (850 - 300) = 0.727
- Denormalized: 0 + 0.727 * (1000 - 0) = 727 ✓

---

## 🛠️ Development Workflow

### Modify Frontend
1. Edit files in `frontend/` (auto-hot-reload)
2. Run tests: `cd frontend && npm test`
3. Commit & push

### Modify Backend
1. Edit files in `backend/` (auto-reload with nodemon)
2. API changes automatically picked up
3. Commit & push

### Add New Country
1. Update `backend/src/services/convertService.js` (add scoring range)
2. Update `frontend/components/ScoreForm.jsx` (add to countries list)
3. Test with form

---

## 📋 Troubleshooting

### Backend port 3001 already in use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### Frontend can't reach backend
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_BACKEND_URL` environment variable
- In docker-compose, use `http://backend:3001`

### Playwright tests timeout
```bash
# Kill existing node processes
taskkill /F /IM node.exe  # Windows
killall node                # macOS/Linux

# Retry tests
npm test
```

### Docker build fails
```bash
# Clean build (no cache)
docker-compose down
docker system prune -a
docker-compose up --build
```

---

## 📚 Additional Resources

- **Vibe Log:** See `vibes-log.md` for AI-assisted development journey
- **Next.js Docs:** https://nextjs.org/docs
- **Express Docs:** https://expressjs.com/
- **TailwindCSS Docs:** https://tailwindcss.com/docs
- **Playwright Docs:** https://playwright.dev/

---

## 📝 License

MIT

---

## 👤 Author

Built with Cline AI Agent

**GitHub Repository:** https://github.com/bhaktofmahakal/global-wealth-id.git

---

## ✅ Checklist

- [x] Backend conversion logic working
- [x] Frontend form + validation
- [x] Recent checks stored in-memory (cap 10)
- [x] TailwindCSS styling responsive
- [x] Dockerfiles production-ready
- [x] docker-compose working locally
- [x] Playwright E2E tests written
- [x] GitHub repo setup
- [x] Azure deployment instructions included
- [x] Vibe log documented

**Status:** Ready for production deployment 🚀
