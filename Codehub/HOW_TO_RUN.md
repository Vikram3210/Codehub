# 🚀 How to Run CodeHub Project

## Prerequisites
- Node.js installed (v14 or higher)
- MongoDB Atlas account
- Your MongoDB connection string

---

## Step 1: Install Dependencies

If you haven't installed dependencies yet:

```bash
npm install
```

---

## Step 2: Setup Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://sakupatil2004_db_user:YOUR_PASSWORD@cluster0.f23zbb5.mongodb.net/CodeHub?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
```

**⚠️ Important:** Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password!

---

## Step 3: Extract Questions (First Time Only)

Extract questions from `levelData.js` to create JSON files:

```bash
npm run extract-questions
```

This creates JSON files in `data/questions/` for each language.

**Expected output:**
```
✅ Created data/questions/javascript.json with X questions
✅ Created data/questions/python.json with X questions
✅ Created data/questions/java.json with X questions
✅ Created data/questions/cpp.json with X questions
🎉 All question files created successfully!
```

---

## Step 4: Seed the Database

Choose one of these options:

### Option A: Seed with Embedded MCQs (Your Structure)
```bash
npm run seed-lessons
```

This stores lessons with embedded MCQs matching your MongoDB structure:
- `levelNumber` (numeric)
- `lessonTitle` 
- `mcqs` array embedded in each lesson

### Option B: Seed with Separate Collections
```bash
npm run seed
```

This stores lessons and questions in separate collections.

**Expected output:**
```
📦 Loading questions from JSON files...
✅ Loaded X questions for javascript
...
🔌 Connecting to MongoDB...
✅ Connected to MongoDB Atlas
🗑️  Clearing existing lessons...
📚 Processing javascript...
  ✅ Level 1: X MCQs embedded
...
📊 Seeding Summary:
   Lessons: X
   Total MCQs: X
🎉 Database seeding completed successfully!
```

---

## Step 5: Start the Backend Server

Open a terminal and run:

```bash
npm run server
```

**Expected output:**
```
✅ Connected to MongoDB Atlas
📊 Database: CodeHub
🚀 Server running on http://localhost:5000
📡 API endpoints available at http://localhost:5000/api
```

**To run with auto-reload (development):**
```bash
npm run server:dev
```

---

## Step 6: Start the Frontend (React App)

Open a **new terminal** (keep the server running) and run:

```bash
npm run dev
```

**Expected output:**
```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 7: Test the Setup

### Test Backend API

1. **Health Check:**
   Open browser: http://localhost:5000/api/health

2. **Get All Languages:**
   http://localhost:5000/api/languages

3. **Get Lessons:**
   http://localhost:5000/api/lessons?languageKey=java

4. **Get Lesson by Level:**
   http://localhost:5000/api/lessons/java/level/1

### Test Frontend

Open browser: http://localhost:5173/

---

## Complete Command Sequence

Here's the complete sequence:

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Create .env file with your MongoDB password
# (Edit .env file manually)

# 3. Extract questions (first time only)
npm run extract-questions

# 4. Seed database
npm run seed-lessons

# 5. Start backend server (Terminal 1)
npm run server

# 6. Start frontend (Terminal 2 - new terminal)
npm run dev
```

---

## Running Both Servers Together

You need **2 terminals**:

### Terminal 1 - Backend:
```bash
npm run server
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run server` | Start backend server (port 5000) |
| `npm run server:dev` | Start backend with auto-reload |
| `npm run dev` | Start frontend (port 5173) |
| `npm run seed-lessons` | Seed database with embedded MCQs |
| `npm run seed` | Seed database with separate collections |
| `npm run extract-questions` | Extract questions to JSON files |
| `npm run build` | Build frontend for production |

---

## Troubleshooting

### ❌ "Cannot connect to MongoDB"
- ✅ Check your password in `.env` file
- ✅ Verify your IP is whitelisted in MongoDB Atlas
- ✅ Check the connection string format

### ❌ "Port 5000 already in use"
- ✅ Change `PORT` in `.env` file
- ✅ Or stop the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

### ❌ "Cannot find module"
- ✅ Run `npm install` to install dependencies

### ❌ "No questions found in JSON file"
- ✅ Run `npm run extract-questions` first
- ✅ Check that `data/questions/` directory exists

### ❌ "EADDRINUSE: address already in use"
- ✅ Another process is using the port
- ✅ Change PORT in `.env` or kill the process

---

## Quick Test Checklist

- [ ] `.env` file created with correct MongoDB password
- [ ] Dependencies installed (`npm install`)
- [ ] Questions extracted (`npm run extract-questions`)
- [ ] Database seeded (`npm run seed-lessons`)
- [ ] Backend server running (`npm run server`)
- [ ] Frontend running (`npm run dev`)
- [ ] Can access http://localhost:5000/api/health
- [ ] Can access http://localhost:5173

---

## Next Steps

After everything is running:

1. **Update Frontend** to fetch data from API instead of mock data
2. **Test API endpoints** using Postman or browser
3. **Verify data** in MongoDB Atlas Data Explorer
4. **Start developing** your features!

---

## Need Help?

- Check `HOW_TO_STORE_IN_MONGODB.md` for database structure
- Check `QUICK_START.md` for quick reference
- Check `MONGODB_SETUP.md` for detailed MongoDB setup


