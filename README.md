# AI Chatbot Application

A full-stack MERN application that allows users to create projects and chat with AI assistants. The application supports multiple AI backends including OpenAI, Groq, and local Ollama models.

![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## Features

- 🔐 **User Authentication**: Secure registration and login with JWT tokens
- 📁 **Project Management**: Create and manage multiple chat projects
- 💬 **AI Chat**: Real-time chat interface with AI assistants
- 🤖 **Multiple AI Backends**:
  - OpenAI GPT models
  - Groq (fast, free inference)
  - Local Ollama models
- 🎨 **Modern UI**: Responsive React interface built with Vite
- 🔄 **Hot Reload**: Development environment with hot module reloading

## Tech Stack

### Frontend
- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Vite 5**: Build tool and dev server
- **Axios**: HTTP client for API requests
- **CSS 3**: Styling

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database (Atlas)
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **Nodemon**: Development server with auto-reload
- **CORS**: Cross-origin resource sharing

## Project Structure

```
chatbot/
├── backend/                      # Node.js/Express backend
│   ├── src/
│   │   ├── app.mjs             # Express app configuration
│   │   ├── server.mjs          # Server entry point
│   │   ├── config/
│   │   │   └── db.mjs          # MongoDB connection
│   │   ├── controllers/        # Route handlers
│   │   │   ├── auth.controller.mjs
│   │   │   ├── chat.controller.mjs
│   │   │   └── project.controller.mjs
│   │   ├── middleware/         # Express middleware
│   │   │   └── auth.middleware.mjs
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.mjs
│   │   │   ├── Project.mjs
│   │   │   └── Prompt.mjs
│   │   └── routes/             # API routes
│   │       ├── auth.routes.mjs
│   │       ├── chat.routes.mjs
│   │       ├── project.routes.mjs
│   │       └── admin.routes.mjs
│   ├── .env                    # Environment variables
│   └── package.json
│
└── frontend/                     # React + Vite frontend
    ├── src/
    │   ├── main.jsx            # React entry point
    │   ├── App.jsx             # Root component
    │   ├── App.css             # Global styles
    │   ├── api/
    │   │   └── api.js          # Axios instance & API calls
    │   ├── components/         # Reusable components
    │   │   └── Navbar.jsx
    │   └── pages/              # Page components
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Dashboard.jsx
    │       └── Chat.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (Atlas account for cloud database)
- **AI API Key** (OpenAI, Groq, or local Ollama)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/chatbot.git
cd chatbot
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create/configure `.env` file with required variables:
```env
PORT=8001
JWT_SECRET=your_jwt_secret_here
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key_optional
GROQ_API_KEY=your_groq_api_key_optional
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama2
```

4. Start backend server:
```bash
npm run dev    # Development mode with hot reload
# OR
npm run start  # Production mode
```

Backend will run on: `http://localhost:8001`

### Step 3: Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create/configure `.env` file (if needed):
```env
VITE_API_URL=http://localhost:8001
```

4. Start frontend dev server:
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Available Scripts

### Backend
```bash
npm run dev    # Start with nodemon (auto-reload)
npm run start  # Start production server
```

### Frontend
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `DELETE /api/projects/:id` - Delete project

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history/:projectId` - Get chat history

## Environment Variables

### Backend `.env`
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 8001 |
| JWT_SECRET | JWT signing secret | `supersecret` |
| MONGO_URI | MongoDB connection string | `mongodb+srv://...` |
| OPENAI_API_KEY | OpenAI API key (optional) | `sk-proj-...` |
| GROQ_API_KEY | Groq API key (optional) | `gsk_...` |
| OLLAMA_BASE_URL | Local Ollama endpoint | `http://127.0.0.1:11434` |
| OLLAMA_MODEL | Ollama model name | `llama2` |

## Authentication Flow

1. User registers with email and password
2. Password is hashed using bcryptjs
3. User receives JWT token on login
4. Token is stored in localStorage
5. Protected routes check for valid token
6. Token is sent in Authorization header for API requests

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  userId: ObjectId (ref: User),
  createdAt: Date
}
```

### Prompt
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Project),
  userId: ObjectId (ref: User),
  userMessage: String,
  aiResponse: String,
  aiBackend: String (openai|groq|ollama),
  createdAt: Date
}
```

## Deployment

### Frontend Deployment (Vercel, Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Render, Railway, Heroku)
Ensure environment variables are set in deployment platform.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed hosting instructions.

## Architecture

For detailed architecture and design explanation, see [ARCHITECTURE.md](./ARCHITECTURE.md)

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure PORT 8001 is not in use
- Verify all dependencies are installed: `npm install`

### Frontend not connecting to backend
- Ensure backend is running on `http://localhost:8001`
- Check CORS settings in backend `app.mjs`
- Verify API base URL in frontend `api/api.js`

### MongoDB connection errors
- Verify MongoDB URI is correct
- Check whitelist IP in MongoDB Atlas
- Ensure network connectivity to Atlas cluster

### AI responses not working
- Verify API key for chosen AI backend (OpenAI/Groq)
- Check API key hasn't expired or reached usage limits
- For Ollama, ensure service is running locally

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Contact & Support

- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

**Happy Chatting! 🤖💬**
