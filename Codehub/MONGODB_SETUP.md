# MongoDB Atlas Setup Guide

## Prerequisites
- MongoDB Atlas account
- Node.js installed
- Your MongoDB connection string

## Step 1: Update Your MongoDB Connection String

1. Create a `.env` file in the root directory (copy from `.env.example` if it exists)
2. Replace `<db_password>` in the connection string with your actual MongoDB Atlas password:

```env
MONGODB_URI=mongodb+srv://sakupatil2004_db_user:YOUR_PASSWORD_HERE@cluster0.f23zbb5.mongodb.net/CodeHub?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
```

## Step 2: Start the Server

```bash
npm run server
```

The server will start on `http://localhost:5000`

## Step 3: Seed the Database

Run the seed script to populate your database with languages, lessons, and questions:

```bash
npm run seed
```

This will:
- Create 4 languages (JavaScript, Python, Java, C++)
- Create all lessons from your `levelData.js` file
- Create all quiz questions for each lesson

## Step 4: Verify the Connection

Visit `http://localhost:5000/api/health` to check if the server and database are connected.

## API Endpoints

### Languages
- `GET /api/languages` - Get all languages
- `GET /api/languages/:key` - Get language by key
- `POST /api/languages` - Create a language
- `PUT /api/languages/:id` - Update a language
- `DELETE /api/languages/:id` - Delete a language

### Lessons
- `GET /api/lessons` - Get all lessons (optional query: `?languageKey=javascript`)
- `GET /api/lessons/:languageKey/:levelId` - Get specific lesson
- `GET /api/lessons/language/:languageKey` - Get all lessons for a language
- `POST /api/lessons` - Create a lesson
- `PUT /api/lessons/:id` - Update a lesson
- `DELETE /api/lessons/:id` - Delete a lesson

### Questions
- `GET /api/questions` - Get all questions (optional queries: `?languageKey=javascript&levelId=js_01_variables`)
- `GET /api/questions/:languageKey/:levelId` - Get questions for a lesson
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create a question
- `PUT /api/questions/:id` - Update a question
- `DELETE /api/questions/:id` - Delete a question

## Database Collections

Your MongoDB database will have three collections:
1. **languages** - Programming languages (JavaScript, Python, Java, C++)
2. **lessons** - Theory lessons for each language
3. **questions** - Quiz questions for each lesson

## Troubleshooting

### Connection Error
- Make sure your MongoDB Atlas password is correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Verify the connection string format

### Seed Script Errors
- Ensure the server is not running when seeding
- Check that `src/data/levelData.js` exists and is properly formatted
- Make sure all dependencies are installed: `npm install`

## Next Steps

After seeding, you can:
1. Update your frontend to fetch data from the API instead of using mock data
2. Add user authentication and progress tracking
3. Extend the API with additional endpoints as needed

