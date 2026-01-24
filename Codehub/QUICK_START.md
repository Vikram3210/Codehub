# Quick Start Guide - MongoDB Atlas Setup

## 🚀 Quick Setup (3 Steps)

### Step 1: Create `.env` file
Create a `.env` file in the root directory with your MongoDB password:

```env
MONGODB_URI=mongodb+srv://sakupatil2004_db_user:YOUR_PASSWORD@cluster0.f23zbb5.mongodb.net/CodeHub?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```

**⚠️ Important:** Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password!

### Step 2: Extract Questions (First Time Only)
Extract questions from `levelData.js` to create JSON files:

```bash
npm run extract-questions
```

This creates separate JSON files in `data/questions/` for each language.

### Step 3: Seed the Database
Run the seed script to populate your database:

```bash
npm run seed
```

This will create:
- ✅ 4 Languages (JavaScript, Python, Java, C++)
- ✅ All lessons from your `levelData.js`
- ✅ All quiz questions from JSON files in `data/questions/`

**Note:** Questions are now stored separately in JSON files, not in `levelData.js`!

### Step 4: Start the Server
Start your Express server:

```bash
npm run server
```

The server will run on `http://localhost:5000`

## 📡 Test the API

Visit these URLs in your browser:

- Health check: http://localhost:5000/api/health
- All languages: http://localhost:5000/api/languages
- JavaScript lessons: http://localhost:5000/api/lessons?languageKey=javascript
- Questions for a lesson: http://localhost:5000/api/questions?languageKey=javascript&levelId=js_01_variables

## 🎯 Next Steps

1. **Update Frontend**: Modify your React components to fetch data from the API instead of using mock data
2. **Add Authentication**: Implement user authentication and progress tracking
3. **Extend API**: Add more endpoints as needed

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- ✅ Check your password in `.env` file
- ✅ Verify your IP is whitelisted in MongoDB Atlas
- ✅ Check the connection string format

### "Cannot import levelData"
- ✅ Ensure `src/data/levelData.js` exists
- ✅ Verify it exports `LEVEL_DATA`

### "No questions found in JSON file"
- ✅ Run `npm run extract-questions` first to create JSON files
- ✅ Ensure `data/questions/` directory exists with language JSON files

### "Port already in use"
- ✅ Change `PORT` in `.env` file
- ✅ Or stop the process using port 5000

## 📚 Full Documentation

See `MONGODB_SETUP.md` for detailed documentation.

