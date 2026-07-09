const Report = require('../models/Report');

// @desc    Ask AI assistant a question about reports
// @route   POST /api/ai/ask
// @access  Private (manager)
const askAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Please provide a question' });
    }

    // Check if API key is configured
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        message: 'AI Assistant is not configured. Please add GROQ_API_KEY or OPENAI_API_KEY to your .env file.',
        fallback: true,
      });
    }

    // Fetch recent submitted reports for context based on role
    const isManager = req.user.role === 'manager';
    const query = isManager ? { status: 'Submitted' } : { userId: req.user._id };

    const reports = await Report.find(query)
      .populate('userId', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    // Build context from reports
    const reportContext = reports
      .map(
        (r) =>
          `[${r.week}] ${r.userId?.name || 'Unknown'} - Project: ${r.project?.name || 'Unknown'}\n` +
          `  Completed: ${r.completedTasks.join(', ') || 'None'}\n` +
          `  Planned: ${r.plannedTasks.join(', ') || 'None'}\n` +
          `  Blockers: ${r.blockers.join(', ') || 'None'}\n` +
          `  Hours: ${r.hoursWorked}`
      )
      .join('\n\n');

    const systemPrompt = isManager
      ? `You are a project manager assistant. Answer only based on the weekly reports data provided below. Summarize blockers, completed tasks, and identify workload imbalance when asked.

WEEKLY REPORTS DATA:
${reportContext}`
      : `You are a team member assistant. Answer only based on your weekly reports data provided below. Summarize your completed tasks, future plans, and blockers when asked.

MY WEEKLY REPORTS DATA:
${reportContext}`;

    // Determine LLM provider (Groq or OpenAI)
    const isGroq = apiKey.startsWith('gsk_') || !!process.env.GROQ_API_KEY;
    const apiUrl = isGroq 
      ? 'https://api.groq.com/openai/v1/chat/completions' 
      : 'https://api.openai.com/v1/chat/completions';
    
    const model = isGroq 
      ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile') 
      : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo');

    // Call API (OpenAI or Groq via OpenAI-compatible endpoint)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      const providerName = isGroq ? 'Groq' : 'OpenAI';
      return res.status(500).json({ message: `${providerName} Error: ${data.error.message || JSON.stringify(data.error)}` });
    }

    res.json({
      answer: data.choices[0].message.content,
      reportsAnalyzed: reports.length,
    });
  } catch (error) {
    console.error('AI ask error:', error.message);
    res.status(500).json({ message: 'Server error processing AI request' });
  }
};

module.exports = { askAI };
