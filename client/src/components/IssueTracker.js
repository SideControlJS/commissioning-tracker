import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/issues`);
      setIssues(res.data);
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
    <div>
      <h3>Issue Tracker</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="description" placeholder="Issue Description" value={newIssue.description} onChange={handleChange} required />
        <input type="text" name="room" placeholder="Room Number" value={newIssue.room} onChange={handleChange} required />
        <input type="text" name="equipment" placeholder="Equipment Serial Number" value={newIssue.equipment} onChange={handleChange} />
        <input type="text" name="assignedTo" placeholder="Assigned To" value={newIssue.assignedTo} onChange={handleChange} />
        <select name="status" value={newIssue.status} onChange={handleChange}>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <button type="submit">Add Issue</button>
      </form>
      <ul>
        {issues.map(issue => (
          <li key={issue._id}>
            {issue.description} - {issue.status} - Assigned to: {issue.assignedTo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueTracker;
