const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:14b";

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

export async function generateCompletion(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
  } = {}
): Promise<string> {
  const { model = DEFAULT_MODEL, system, temperature = 0.7 } = options;

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      system,
      stream: false,
      options: { temperature },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data: OllamaResponse = await response.json();
  return data.response;
}

export async function chat(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  options: {
    model?: string;
    temperature?: number;
  } = {}
): Promise<string> {
  const { model = DEFAULT_MODEL, temperature = 0.7 } = options;

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: { temperature },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || "";
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}
