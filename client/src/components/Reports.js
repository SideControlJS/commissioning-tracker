import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField } from '@mui/material';

const Reports = ({ projectId }) => {
  const [report, setReport] = useState(null);
  const [email, setEmail] = useState('');

  const fetchReport = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/reports/daily`);
      setReport(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendReport = async () => {
    try {
      await axios.post(`http://localhost:5000/api/projects/${projectId}/reports/send-daily`, { email });
      alert('Report sent successfully!');
    } catch (error) {
      console.error(error);
      alert('Error sending report.');
    }
  };

  useEffect(() => {
    fetchReport();
  }, [projectId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Daily Report
      </Typography>
      {report ? (
        <div>
          <Typography>Date: {report.date}</Typography>
          <Typography>Completed Rooms: {report.completedRooms}</Typography>
          <Typography>New Issues: {report.newIssues}</Typography>
          <Typography>Resolved Issues: {report.resolvedIssues}</Typography>
          <Typography>Outstanding Issues: {report.outstandingIssues}</Typography>
          <TextField
            type="email"
            label="Client Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          <Button variant="contained" color="primary" onClick={sendReport}>
            Send Report via Email
          </Button>
        </div>
      ) : (
        <Typography>Loading report...</Typography>
      )}
    </Container>
  );
};

export default Reports;
