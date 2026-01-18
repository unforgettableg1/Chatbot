# Contributing Guidelines

Thank you for your interest in contributing to the AI Chatbot project! Here's how you can help.

## Code of Conduct
- Be respectful and inclusive
- No harassment or discrimination
- Focus on constructive feedback

## How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/yourusername/chatbot.git
cd chatbot
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow existing code style
- Add comments for complex logic
- Test your changes

### 4. Commit & Push
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 5. Submit Pull Request
- Clear description of changes
- Link to related issues
- Screenshots if UI changes

## Code Style

### JavaScript/JSX
- Use ES6+ syntax
- 2-space indentation
- Meaningful variable names
- Add JSDoc comments for functions

### Example:
```javascript
/**
 * Fetches chat history for a project
 * @param {string} projectId - The project ID
 * @returns {Promise<Array>} Chat history
 */
export const getChatHistory = async (projectId) => {
  // Implementation
};
```

## Testing
- Write tests for new features
- Ensure existing tests pass
- Aim for >80% code coverage

## Commit Messages
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Find process on port 8001
lsof -i :8001
# Kill it
kill -9 <PID>
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

Thank you for contributing!
