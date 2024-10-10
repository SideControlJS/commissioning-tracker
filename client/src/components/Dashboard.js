import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project._id}>{project.name} - {project.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
