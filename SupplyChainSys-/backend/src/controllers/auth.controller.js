const authService = require('../services/auth.service');
const logger = require('../utils/logger');

const register = async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: { user, token } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }
  const { user, token } = await authService.loginUser(email, password);
  res.status(200).json({ success: true, data: { user, token } });
};

const getProfile = async (req, res) => {
  // Assuming authMiddleware sets req.user
  const userId = req.user && req.user.id;
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }
  const user = await authService.getUserProfile(userId);
  res.status(200).json({ success: true, data: user });
};

const googleAuth = async (req, res) => {
  // Mock OAuth redirection success for Google
  const { user, token } = await authService.registerUser({
     name: 'Google User',
     email: `google_${Date.now()}@test.com`,
     password: 'mock_oauth_password',
     company: 'Google Integrations'
  }).catch(async () => {
     // If user exists or mock fails, just login generic
     return await authService.loginUser('operator@logistica.com', 'password').catch(() => ({ user: { name: 'G-User' }, token: 'mock-g-token' }));
  });
  
  res.redirect(`http://localhost:5173/?token=${token}&name=${encodeURIComponent(user.name)}`);
};

const githubAuth = async (req, res) => {
  // Mock OAuth redirection success for Github
  res.redirect(`http://localhost:5173/?token=mock-github-token&name=GithubUser`);
};

module.exports = { register, login, getProfile, googleAuth, githubAuth };
