import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type = "chat" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Context-aware system prompts based on type
    const systemPrompts: Record<string, string> = {
      chat: `You are SAM (Student Admission Manager), a friendly and knowledgeable AI assistant for the Student Admission Portal. 
You help students with:
- Application process questions (documents needed, deadlines, eligibility)
- Admission requirements and courses offered
- Fee structure and scholarship information
- Document verification guidance
- Status checking and next steps

Be concise, helpful, and empathetic. Use emojis sparingly to keep the tone friendly. 
If you don't know something specific, guide them to contact the admission office.
Current academic year: 2025-26.

Important info:
- Required documents: Photo, ID Proof (Aadhar/PAN), 10th Marksheet, 12th Marksheet
- Courses: B.Tech (CS, ECE, ME, CE), BBA, BCA, MBA, MCA, B.Com, BA
- Application fee: ₹500 (non-refundable)
- Deadline: Usually end of June`,

      insights: `You are an AI analyst providing insights on student applications. 
Analyze the provided application data and give actionable insights about:
- Application completion rates
- Common issues or bottlenecks
- Suggestions for improving the admission process
- Trends and patterns
Be data-driven and provide specific, actionable recommendations.`,

      verify: `You are a document verification assistant. 
Help verify if uploaded documents meet requirements:
- Photo: Clear passport-size photo, proper lighting
- ID Proof: Valid Aadhar Card or PAN Card, clearly visible
- Marksheets: Official documents with school/board seal
Provide helpful feedback on what needs improvement.`
    };

    const systemContent = systemPrompts[type] || systemPrompts.chat;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI is currently busy. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
