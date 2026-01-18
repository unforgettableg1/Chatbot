import axios from 'axios';
import Prompt from '../models/Prompt.mjs';

// Default to a public, router-compatible model; override with HUGGINGFACE_MODEL if desired.
const HF_MODEL = process.env.HUGGINGFACE_MODEL || 'HuggingFaceH4/zephyr-7b-beta';
const HF_BASE_URL = `https://router.huggingface.co/models/${HF_MODEL}`;

// Local no-key option via Ollama; override model/base with env.
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const OLLAMA_BASE = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');

const mockReply = (prompt) => {
  const trimmed = (prompt || '').trim();
  if (!trimmed) return 'I need a question or prompt to respond to.';
  const preview = trimmed.length > 220 ? `${trimmed.slice(0, 220)}…` : trimmed;
  return `Offline preview: ${preview}`;
};

export const chat = async (req, res) => {
  try {
    const { prompt, projectId } = req.body;

    // If no HF key, try local Ollama; fallback to offline stub if unreachable.
    if (!process.env.HUGGINGFACE_API_KEY) {
      try {
        const ollamaResponse = await axios.post(
          `${OLLAMA_BASE}/api/chat`,
          {
            model: OLLAMA_MODEL,
            messages: [{ role: 'user', content: prompt }],
            stream: false,
          },
          { timeout: 20000 }
        );

        const aiResponse = ollamaResponse.data?.message?.content || 'No response generated';
        const savedPrompt = await Prompt.create({
          projectId,
          userId: req.userId,
          prompt,
          response: aiResponse,
        });

        return res.json({
          prompt: savedPrompt.prompt,
          response: savedPrompt.response,
          note: `Served by local Ollama model ${OLLAMA_MODEL}`,
        });
      } catch (ollamaErr) {
        console.warn('Ollama unavailable, using offline mock:', ollamaErr.message);
        const aiResponse = mockReply(prompt);
        const savedPrompt = await Prompt.create({
          projectId,
          userId: req.userId,
          prompt,
          response: aiResponse,
        });

        return res.json({
          prompt: savedPrompt.prompt,
          response: savedPrompt.response,
          note: 'Served by offline mock because no API key or local model.',
        });
      }
    }

    const hfResponse = await axios.post(
      HF_BASE_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 400,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
        options: {
          wait_for_model: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const aiResponse = hfResponse.data?.[0]?.generated_text || 'No response generated';

    const savedPrompt = await Prompt.create({
      projectId,
      userId: req.userId,
      prompt,
      response: aiResponse,
    });

    res.json({
      prompt: savedPrompt.prompt,
      response: savedPrompt.response,
    });
  } catch (error) {
    console.error('Chat error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const msg = error.response?.data?.error || error.message || 'Failed to generate response';
    res.status(status === 404 ? 500 : status).json({
      message: 'Failed to generate response',
      error: msg,
    });
  }
};

export const getChats = async (req, res) => {
  try {
    const { projectId } = req.params;
    const chats = await Prompt.find({ 
      projectId, 
      userId: req.userId 
    }).sort({ createdAt: 1 });
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
