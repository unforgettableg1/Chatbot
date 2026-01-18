# Architecture & Design

## System Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to provide a scalable platform for managing AI-powered chat projects.

```
┌─────────────────────────────────────────────────────────┐
│                   Client Browser                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │        React Frontend (Vite)                     │  │
│  │  - SPA with React Router                         │  │
│  │  - Protected routes with JWT auth               │  │
│  │  - Real-time chat UI                            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP/REST API
                 │ JWT Token in Headers
                 ▼
┌─────────────────────────────────────────────────────────┐
│          Express Server (Node.js Backend)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Routes & Controllers                             │  │
│  │  - /api/auth - Authentication                   │  │
│  │  - /api/projects - Project CRUD                 │  │
│  │  - /api/chat - Chat operations                  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Middleware                                       │  │
│  │  - Auth verification                             │  │
│  │  - CORS handling                                 │  │
│  │  - Request/Response processing                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ AI Integration Layer                             │  │
│  │  - OpenAI API client                             │  │
│  │  - Groq API client                               │  │
│  │  - Ollama local client                           │  │
│  └──────────────────────────────────────────────────┘  │
└────┬──────────────────────────────┬────────────────────┘
     │                              │
     │ Mongoose ODM                 │ HTTP Requests
     ▼                              ▼
┌──────────────────┐         ┌─────────────────┐
│   MongoDB Atlas  │         │ AI Service APIs │
│   (Database)     │         │  - OpenAI       │
│                  │         │  - Groq         │
│ - Users          │         │  - Ollama       │
│ - Projects       │         └─────────────────┘
│ - Chat History   │
└──────────────────┘
```

## Core Components

### 1. Authentication System

**Flow:**
1. User registers → Password hashed with bcryptjs
2. Credentials stored in MongoDB
3. Login → JWT token generated and sent to client
4. Token stored in localStorage
5. Protected routes check token validity
6. Token sent in Authorization header for API requests

**Security Features:**
- Passwords hashed with salt (bcryptjs)
- JWT tokens with expiration
- Protected API endpoints with middleware
- CORS enabled for trusted domains

### 2. Project Management

**User Workflow:**
1. User creates a project
2. Project linked to user via userId
3. Multiple chat conversations per project
4. Project acts as namespace for chat history

**Database Relations:**
```
User (1) ─── (Many) Projects
User (1) ─── (Many) Prompts
Project (1) ─── (Many) Prompts
```

### 3. Chat System

**Message Flow:**
```
Client Message Input
        ↓
React Component (Chat.jsx)
        ↓
API Call (POST /api/chat/send)
        ↓
Backend Route Handler
        ↓
Chat Controller
        ↓
AI Service Integration
        ├─ OpenAI API
        ├─ Groq API
        └─ Ollama Local
        ↓
Store in MongoDB (Prompt schema)
        ↓
Return Response to Client
        ↓
Update UI with Message & Response
```

### 4. Frontend Architecture

**Components Structure:**
```
App.jsx (Root)
├── Router & Routes
├── ProtectedRoute (Auth wrapper)
└── Pages
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx
    ├── Chat.jsx
    └── Navbar.jsx
```

**State Management:**
- Uses React hooks (useState, useEffect)
- localStorage for token persistence
- Context could be added for global state

**API Integration:**
```javascript
// api/api.js
- Axios instance with base URL
- Request/Response interceptors
- Token attachment to headers
- Error handling
```

### 5. Backend Architecture

**Layers:**

1. **Routes Layer** (`routes/`)
   - Define API endpoints
   - Map to controller functions
   - Apply middleware

2. **Controllers Layer** (`controllers/`)
   - Handle business logic
   - Validate requests
   - Manage responses

3. **Models Layer** (`models/`)
   - Mongoose schemas
   - Data validation
   - Database operations

4. **Middleware Layer** (`middleware/`)
   - Authentication
   - Authorization
   - Request processing

5. **Config Layer** (`config/`)
   - Database connection
   - Environment setup

## AI Integration

### OpenAI Backend
- Direct API integration
- Requires API key
- Supports GPT-3.5, GPT-4 models
- Pricing: Pay-per-token

### Groq Backend
- Free tier available
- Fast inference
- No rate limits on free tier
- Requires API key

### Ollama Backend
- Local LLM execution
- No internet required
- Models: Llama 2, Mistral, etc.
- Free (requires local setup)

**Selection Logic:**
```javascript
switch(selectedBackend) {
  case 'openai':
    return await callOpenAI(message);
  case 'groq':
    return await callGroq(message);
  case 'ollama':
    return await callOllama(message);
}
```

## Data Flow

### Registration Flow
```
1. User enters email/password → Frontend
2. Frontend validates & sends POST /api/auth/register
3. Backend receives request
4. Validates email uniqueness
5. Hashes password with bcryptjs
6. Stores user in MongoDB
7. Returns success/error
8. Frontend stores token if successful
```

### Chat Message Flow
```
1. User types message in Chat UI
2. Click send → API call to POST /api/chat/send
3. Backend receives {message, projectId}
4. Auth middleware verifies JWT
5. Chat controller processes message
6. Selects AI backend & calls API
7. Receives AI response
8. Stores conversation in MongoDB (Prompt collection)
9. Returns both user message & AI response
10. Frontend updates chat UI
```

## Scalability Considerations

### Current State (MVP)
- Single server instance
- MongoDB Atlas (managed)
- Basic error handling
- Direct API calls to AI services

### Future Improvements
- **Load Balancing**: Nginx or AWS ELB
- **Caching**: Redis for frequently accessed data
- **Queue System**: Bull/RabbitMQ for async tasks
- **Rate Limiting**: Prevent API abuse
- **Monitoring**: Sentry, DataDog for error tracking
- **CDN**: For static assets
- **Database Optimization**: Indexing, connection pooling
- **Microservices**: Separate AI service microservice

## Security Architecture

### Frontend Security
- XSS Prevention: React auto-escapes content
- CSRF: Token-based (JWT)
- Secure token storage: localStorage
- HTTPS enforced in production

### Backend Security
- Input validation: All API endpoints
- SQL Injection Prevention: Using Mongoose ODM
- Password hashing: bcryptjs with salt
- JWT verification: On protected routes
- CORS: Whitelist trusted origins
- Rate limiting: Can be added with express-rate-limit
- API key management: Environment variables (never in code)

## Performance Optimization

1. **Frontend**
   - Code splitting with Vite
   - Lazy loading routes
   - Image optimization
   - CSS minimization

2. **Backend**
   - Database indexing on frequently queried fields
   - Connection pooling with Mongoose
   - Response compression
   - Async/await for non-blocking operations

3. **API**
   - Pagination for list endpoints
   - Caching headers
   - Request/response compression

## Error Handling

### Frontend
- Try-catch in async operations
- User-friendly error messages
- Network error handling
- Form validation

### Backend
- Global error handler
- HTTP status codes
- Error logging
- Stack traces in development

## Environment Setup

```
Development:
- Hot reload enabled (Nodemon, Vite)
- Detailed error logs
- Unminified code

Production:
- Environment variables set
- HTTPS enabled
- Minified/optimized code
- Rate limiting enabled
- Request logging
```

## Testing Strategy (Recommended)

- **Frontend**: Jest + React Testing Library
- **Backend**: Mocha + Chai or Jest
- **Integration**: Postman/Insomnia for API testing
- **E2E**: Cypress or Playwright

## Deployment Architecture

```
User's Browser
        ↓
CDN (Static Assets)
        ↓
Vercel/Netlify (Frontend)
        ↓
API Gateway/Load Balancer
        ↓
Docker Container (Express App)
        ↓
Render/Railway/Heroku
        ↓
MongoDB Atlas
```

## Key Design Decisions

1. **Why MERN?**
   - Full JavaScript stack
   - Single language across frontend & backend
   - Large ecosystem & community support
   - Easy to learn and maintain

2. **Why JWT instead of sessions?**
   - Stateless authentication
   - Scalable (no session storage needed)
   - Works well with SPAs
   - Easier API authentication

3. **Why MongoDB?**
   - Flexible schema for chat data
   - Good for rapid development
   - Scales horizontally
   - Easy document storage

4. **Why Multiple AI Backends?**
   - Provider flexibility
   - Cost optimization
   - Fallback options
   - User choice

---

**Last Updated**: January 2026
