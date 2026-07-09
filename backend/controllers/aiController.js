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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        message: 'AI Assistant is not configured. Please add OPENAI_API_KEY to your .env file.',
        fallback: true,
      });
    }

    // Fetch recent submitted reports for context
    const reports = await Report.find({ status: 'Submitted' })
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

    const systemPrompt = `You are a project manager assistant. Answer only based on the weekly reports data provided below. Summarize blockers, completed tasks, and identify workload imbalance when asked.

WEEKLY REPORTS DATA:
${reportContext}`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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
      return res.status(500).json({ message: `OpenAI Error: ${data.error.message}` });
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
