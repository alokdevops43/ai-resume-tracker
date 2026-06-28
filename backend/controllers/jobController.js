const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getJobs = async (req, res) => {
  try {
    const jobs = await prisma.jobApplication.findMany({
      where: { userId: req.user.id },
      orderBy: { appliedDate: 'desc' }
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { company, title, status, notes } = req.body;
    if (!company || !title) {
      return res.status(400).json({ error: 'Company and title are required' });
    }

    const job = await prisma.jobApplication.create({
      data: {
        company,
        title,
        status: status || 'Applied',
        notes,
        userId: req.user.id
      }
    });
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, title, status, notes } = req.body;

    // Check ownership
    const existingJob = await prisma.jobApplication.findUnique({ where: { id: parseInt(id) } });
    if (!existingJob || existingJob.userId !== req.user.id) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = await prisma.jobApplication.update({
      where: { id: parseInt(id) },
      data: { company, title, status, notes }
    });
    res.status(200).json(job);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const existingJob = await prisma.jobApplication.findUnique({ where: { id: parseInt(id) } });
    if (!existingJob || existingJob.userId !== req.user.id) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await prisma.jobApplication.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};
