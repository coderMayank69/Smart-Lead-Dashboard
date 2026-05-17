import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  const { message, context } = req.body as { message?: string; context?: string };

  if (!message?.trim()) {
    res.status(400).json({ success: false, message: "Message is required" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(503).json({ success: false, message: "AI service not configured" });
    return;
  }

  try {
    const systemPrompt = `You are an AI sales analytics assistant for GigFlow – Smart Leads Dashboard — a CRM platform.
You help sales teams understand their lead pipeline, conversion rates, and performance metrics.
Be concise, data-driven, and actionable. Keep answers under 3 sentences unless asked for detail.
${context ? `Current dashboard context: ${context}` : ""}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("[Groq] Error:", err);
      res.status(502).json({ success: false, message: "AI service error" });
      return;
    }

    const data = await groqRes.json() as {
      choices: { message: { content: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content ?? "No response";
    res.json({ success: true, data: { reply } });
  } catch (err) {
    console.error("[Groq] Fetch error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
});

export default router;
