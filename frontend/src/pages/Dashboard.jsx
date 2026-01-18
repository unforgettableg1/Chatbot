import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    try {
      await api.post('/projects', { name: projectName });
      setProjectName('');
      loadProjects();
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      loadProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>My Projects</h2>
          <form onSubmit={createProject} className="create-project">
            <input
              type="text"
              placeholder="New project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <button type="submit" className="btn">Create Project</button>
          </form>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p>Created {new Date(project.createdAt).toLocaleDateString()}</p>
              <div className="project-actions">
                <button 
                  className="btn"
                  onClick={() => navigate(`/chat/${project._id}`)}
                >
                  Open Chat
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteProject(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
