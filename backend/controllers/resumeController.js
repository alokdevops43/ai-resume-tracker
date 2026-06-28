const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai');

const prisma = new PrismaClient();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || ext === '.docx') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

exports.uploadMiddleware = upload.single('resume');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }

    const resume = await prisma.resume.create({
      data: {
        filename: req.file.filename,
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { uploadedAt: 'desc' }
    });
    res.status(200).json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to get resumes' });
  }
};

const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  
  throw new Error('Unsupported file format');
};

exports.analyzeResume = async (req, res) => {
  try {
    // 1. Find the most recently uploaded resume for the user
    const latestResume = await prisma.resume.findFirst({
      where: { userId: req.user.id },
      orderBy: { uploadedAt: 'desc' }
    });

    if (!latestResume) {
      return res.status(400).json({ error: 'No resume found. Please upload a resume first.' });
    }

    const filePath = path.join(uploadDir, latestResume.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Resume file missing on server.' });
    }

    // 2. Extract text from the physical file
    const resumeText = await extractTextFromFile(filePath);

    // 3. Setup OpenAI Client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // 4. Create the precise prompt
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) software and senior technical recruiter. 
    Analyze the provided resume text and return a JSON object EXACTLY matching this structure, with no extra text or markdown:
    {
      "score": <number 0-100>,
      "categories": {
        "contact": { "score": <number 0-100>, "status": "<'good', 'warning', or 'error'>" },
        "skills": { "score": <number 0-100>, "status": "<'good', 'warning', or 'error'>" },
        "experience": { "score": <number 0-100>, "status": "<'good', 'warning', or 'error'>" },
        "education": { "score": <number 0-100>, "status": "<'good', 'warning', or 'error'>" },
        "projects": { "score": <number 0-100>, "status": "<'good', 'warning', or 'error'>" },
        "keywords": { "score": <number 0-100>, "status": "<'good', 'warning', or 'error'>" }
      },
      "strengths": ["<string>", "<string>"],
      "weaknesses": ["<string>", "<string>"],
      "missingKeywords": ["<string>", "<string>"],
      "suggestions": ["<string>", "<string>"]
    }
    Base your scores on keyword density, action verbs, clear formatting, measurable impacts, and industry standards.`;

    // 5. Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here is the resume text:\n\n${resumeText}` }
      ],
      response_format: { type: 'json_object' }
    });

    // 6. Parse and send the result
    const analysisResult = JSON.parse(response.choices[0].message.content);
    
    res.status(200).json({ analysis: analysisResult });
    
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    if (error.code === 'invalid_api_key' || error.status === 401) {
      return res.status(500).json({ error: 'OpenAI API key is invalid or not configured.' });
    }
    res.status(500).json({ error: 'Failed to analyze resume with AI.' });
  }
};
