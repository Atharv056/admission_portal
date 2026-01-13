import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
interface Message {
  role: "user" | "assistant";
  content: string;
}
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const quickActions = [{
  label: "📋 Required Documents",
  message: "What documents do I need for admission?"
}, {
  label: "📅 Application Deadline",
  message: "When is the application deadline?"
}, {
  label: "💰 Fee Structure",
  message: "What is the fee structure for courses?"
}, {
  label: "🎓 Courses Offered",
  message: "What courses are available for admission?"
}];
export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "👋 Hi! I'm SAM, your Student Admission Manager. How can I help you today? Feel free to ask about admissions, documents, deadlines, or anything else!"
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    const userMessage: Message = {
      role: "user",
      content: messageText.trim()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1) {
          return prev.map((m, i) => i === prev.length - 1 ? {
            ...m,
            content: assistantContent
          } : m);
        }
        return [...prev, {
          role: "assistant",
          content: assistantContent
        }];
      });
    };
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].slice(-10),
          // Keep last 10 messages for context
          type: "chat"
        })
      });
      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || "Failed to get response");
      }
      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No response body");
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {
          stream: true
        });
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) updateAssistant(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again or contact our admission office directly. 📞"
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  return <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && <motion.div initial={{
        scale: 0,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0,
        opacity: 0
      }} className="fixed bottom-6 right-6 z-50">
            <Button onClick={() => setIsOpen(true)} size="lg" className="h-13 w-13 rounded-full bg-primary hover:bg-primary/90 transition-all border-dashed" aria-label="Open AI Assistant">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary items-center justify-center">
                  <Sparkles className="h-5 w-5 rounded-full transition-all bg-primary text-[#ff3300]" />
                </span>
              </span>
            </Button>
          </motion.div>}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} transition={{
        type: "spring",
        damping: 25,
        stiffness: 300
      }} className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]">
            <Card className="shadow-2xl border-2 overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">SAM Assistant</CardTitle>
                      <p className="text-xs opacity-80">AI-Powered Help</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)} aria-label="Close chat">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[350px] p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => <motion.div key={index} initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        {message.role === "assistant" && <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-secondary" />
                          </div>}
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${message.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                          {message.content}
                        </div>
                        {message.role === "user" && <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-primary" />
                          </div>}
                      </motion.div>)}
                    {isLoading && messages[messages.length - 1]?.role === "user" && <motion.div initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} className="flex gap-2 justify-start">
                        <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      </motion.div>}
                  </div>
                </ScrollArea>

                {/* Quick Actions */}
                {messages.length <= 2 && <div className="px-4 pb-2">
                    <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickActions.map((action, index) => <Button key={index} variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => sendMessage(action.message)} disabled={isLoading}>
                          {action.label}
                        </Button>)}
                    </div>
                  </div>}

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t bg-card">
                  <div className="flex gap-2">
                    <Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." className="flex-1" disabled={isLoading} aria-label="Chat message input" />
                    <Button type="submit" size="icon" disabled={!input.trim() || isLoading} aria-label="Send message">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>}
      </AnimatePresence>
    </>;
}