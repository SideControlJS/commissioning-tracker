const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Room = require('../models/Room');
const Project = require('../models/Project');
const Equipment = require('../models/Equipment');
const nodemailer = require('nodemailer');

// Generate daily report for a project
router.get('/projects/:projectId/reports/daily', async (req, res) => {
  try {
    const { projectId } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch issues created today
    const newIssues = await Issue.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      project: projectId,
    });

    // Fetch issues resolved today
    const resolvedIssues = await Issue.find({
      resolvedAt: { $gte: startOfDay, $lte: endOfDay },
      project: projectId,
    });

    // Fetch completed rooms today (assuming you have a field to track this)
    // Example: rooms with status 'complete' and updated today
    const completedRooms = await Room.find({
      status: 'complete',
      updatedAt: { $gte: startOfDay, $lte: endOfDay },
      project: projectId,
    });

    const report = {
      date: today.toLocaleDateString(),
      completedRooms: completedRooms.length,
      newIssues: newIssues.length,
      resolvedIssues: resolvedIssues.length,
      outstandingIssues: await Issue.find({ project: projectId, status: { $ne: 'resolved' } }).countDocuments(),
    };

    res.json(report);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Optionally, add a route to send the report via email
/*router.post('/projects/:projectId/reports/send-daily', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    // Fetch the report data
    const reportRes = await router.handle({ method: 'GET', params: { projectId }, url: `/projects/${projectId}/reports/daily` }, res);
    const report = reportRes.locals.body; // Adjust based on your response handling

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or another email service
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    // Define email options
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: `Daily Report for Project ID: ${projectId}`,
      text: `Date: ${report.date}\nCompleted Rooms: ${report.completedRooms}\nNew Issues: ${report.newIssues}\nResolved Issues: ${report.resolvedIssues}\nOutstanding Issues: ${report.outstandingIssues}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Report sent successfully');
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});
*/
module.exports = router;
