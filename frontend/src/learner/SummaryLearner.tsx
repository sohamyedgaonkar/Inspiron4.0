import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Sprout, Users, GraduationCap, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type Skill = {
  id: string;
  name: string;
  code: string;
  color: string;
};

type Person = {
  id: string;
  name: string;
  initial: string;
  color: string;
};

type SummaryData = {
  currentSkills: Skill[];
  targetSkills: Skill[];
  buddies: Person[];
  mentors: Person[];
};

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you with your learning journey today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    try {
      // Send message to your backend API
      const response = await axios.post('http://localhost:5000/chat', {
        message: message
      });
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Card className="bg-black/50 border-border/50 mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-400" /> Learning Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[300px]">
          <div className="flex-1 overflow-auto p-4 space-y-4 bg-black/20 rounded-md mb-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender === 'user' 
                      ? 'bg-purple-500/20' 
                      : 'bg-blue-500/20'
                  }`}
                >
                  <p className="text-sm text-white">{msg.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={message.trim() === ""}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Summary = () => {
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://localhost:5000/get-summary')
            .then(response => {
                setSummaryData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching summary data:', error);
                setError('Failed to load summary data');
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="container mx-auto py-8 px-4 mt-16">Loading...</p>;
    if (error) return <p className="container mx-auto py-8 px-4 mt-16">{error}</p>;
    if (!summaryData) return <p className="container mx-auto py-8 px-4 mt-16">No data available</p>;

    return (
        <div className="container mx-auto py-8 px-4 mt-16">
            <h1 className="text-3xl font-bold mb-8">Learning Summary</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-400" /> Current Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {summaryData.currentSkills.map(skill => (
                                <li key={skill.id} className="flex items-center gap-2">
                                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-${skill.color}-500/20 text-${skill.color}-400`}>
                                        {skill.code}
                                    </span>
                                    <span>{skill.name}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-black/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sprout className="h-5 w-5 text-green-400" /> Skills to be Developed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {summaryData.targetSkills.map(skill => (
                                <li key={skill.id} className="flex items-center gap-2">
                                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-${skill.color}-500/20 text-${skill.color}-400`}>
                                        {skill.code}
                                    </span>
                                    <span>{skill.name}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-black/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-400" /> Buddies
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {summaryData.buddies.map(buddy => (
                                <li key={buddy.id} className="flex items-center gap-2">
                                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-${buddy.color}-500/20 text-${buddy.color}-400`}>
                                        {buddy.initial}
                                    </span>
                                    <span>{buddy.name}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-black/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-amber-400" /> Mentors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {summaryData.mentors.map(mentor => (
                                <li key={mentor.id} className="flex items-center gap-2">
                                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-${mentor.color}-500/20 text-${mentor.color}-400`}>
                                        {mentor.initial}
                                    </span>
                                    <span>{mentor.name}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Add the ChatBot component at the end */}
            <ChatBot />
        </div>
    );
};

export default Summary;