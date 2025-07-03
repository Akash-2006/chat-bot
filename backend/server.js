import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";
const apiKey = Deno.env.get("OPENROUTER_API_KEY");
serve(async (req) => {
  const { method } = req;
  const pathname = new URL(req.url).pathname;

  // ✅ Handle CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // ✅ Handle POST /chat
  if (method === "POST" && pathname === "/chat") {
    try {
      const { message } = await req.json();

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost",
            "X-Title": "MyTestChatApp",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: message },
            ],
          }),
        }
      );

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No reply from AI.";

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err) {
      console.error("Error:", err);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }

  // ❌ All other routes
  return new Response("Not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
