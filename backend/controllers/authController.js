const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id, user.email);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true, createdAt: true }
    });

    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id }
    });

    // In a real app with AI, resumes would have an ATS score. 
    // Since we only have a placeholder analyzer that doesn't save to DB yet, we mock an average score.
    const averageAtsScore = resumes.length > 0 ? 78 : 0; 

    const jobs = await prisma.jobApplication.findMany({
      where: { userId: req.user.id }
    });

    const jobStats = {
      total: jobs.length,
      applied: jobs.filter(j => j.status === 'Applied').length,
      interview: jobs.filter(j => j.status === 'Interview').length,
      offer: jobs.filter(j => j.status === 'Offer').length,
      rejected: jobs.filter(j => j.status === 'Rejected').length
    };

    res.status(200).json({
      user: { email: user.email, joinedDate: user.createdAt },
      resumes: { total: resumes.length, averageAtsScore },
      jobs: jobStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};
