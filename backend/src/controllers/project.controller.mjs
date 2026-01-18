import Project from '../models/Project.mjs';

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const project = await Project.create({
      name,
      userId: req.userId,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
