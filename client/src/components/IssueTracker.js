import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const IssueTracker = ({ projectId }) => {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({
    description: '',
    room: '',
    equipment: '',
    assignedTo: '',
    status: 'open',
  });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/issues`);
        setIssues(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIssues();
  }, [projectId]);

  const handleChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/projects/${projectId}/issues`, newIssue);
      setNewIssue({ description: '', room: '', equipment: '', assignedTo: '', status: 'open' });
      // Refresh issues
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/issues`);
      setIssues(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Issue Tracker
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="description" label="Issue Description" fullWidth variant="outlined" value={newIssue.description} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField name="room" label="Room Number" fullWidth variant="outlined" value={newIssue.room} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField name="equipment" label="Equipment Serial Number" fullWidth variant="outlined" value={newIssue.equipment} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField name="assignedTo" label="Assigned To" fullWidth variant="outlined" value={newIssue.assignedTo} onChange={handleChange} sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" color="primary">
          Add Issue
        </Button>
      </form>
      <Paper sx={{ overflowX: 'auto', mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map(issue => (
              <TableRow key={issue._id}>
                <TableCell>{issue.description}</TableCell>
                <TableCell>{issue.room}</TableCell>
                <TableCell>{issue.assignedTo}</TableCell>
                <TableCell>{issue.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default IssueTracker;

