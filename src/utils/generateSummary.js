// Note: In a real implementation, you should use environment variables for API keys
// and make API calls through a backend service for security

export const generateSummary = async (transcript, language = "English") => {
  try {
    // For demo purposes, we'll create a mock summary
    // In real implementation, you would call OpenAI API through your backend

    const prompt =
      language === "Bengali"
        ? `নিম্নলিখিত ভিডিও ট্রান্সক্রিপ্টটিকে একটি সংক্ষিপ্ত, স্পষ্ট নোটে সংক্ষিপ্ত করুন। বুলেট পয়েন্ট, ব্যাখ্যা এবং উদাহরণ ব্যবহার করুন। বাংলায় অনুবাদ করুন।`
        : `Summarize this video transcript into a concise, clear note for students. Use bullet points, explanations, and examples.`;

    // Mock summary based on language
    const mockSummary =
      language === "Bengali"
        ? generateBengaliSummary()
        : generateEnglishSummary();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return mockSummary;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
};

const generateEnglishSummary = () => {
  return `# React Components - Learning Notes

## Overview
React components are the fundamental building blocks of React applications that enable you to create reusable UI elements.

## Key Concepts

### Types of Components
• **Functional Components** - Simpler, recommended approach
• **Class Components** - Traditional approach (less common now)

### JSX Syntax
• HTML-like syntax written in JavaScript
• Must return a single parent element
• Use React fragments (\`<>\`) to avoid extra DOM nodes

### Props
• Used to pass data from parent to child components
• Read-only properties
• Enable component reusability

### State Management
• Allows components to manage internal data
• Use \`useState\` hook in functional components
• State updates trigger re-renders

### Event Handling
• Similar to HTML but uses camelCase naming
• Example: \`onClick\`, \`onChange\`, \`onSubmit\`
• Remember to bind event handlers properly

## Best Practices
• Keep components small and focused
• Use descriptive component names
• Separate logic from presentation
• Practice regularly to improve skills

## Next Steps
• Build simple components
• Practice with props and state
• Learn about component lifecycle
• Explore advanced patterns`;
};

const generateBengaliSummary = () => {
  return `# রিয়েক্ট কম্পোনেন্ট - শিক্ষার নোট

## সংক্ষিপ্ত বিবরণ
রিয়েক্ট কম্পোনেন্ট হল রিয়েক্ট অ্যাপ্লিকেশনের মৌলিক ভিত্তি যা আপনাকে পুনঃব্যবহারযোগ্য UI উপাদান তৈরি করতে সক্ষম করে।

## মূল ধারণাসমূহ

### কম্পোনেন্টের ধরন
• **ফাংশনাল কম্পোনেন্ট** - সহজ, প্রস্তাবিত পদ্ধতি
• **ক্লাস কম্পোনেন্ট** - ঐতিহ্যগত পদ্ধতি (এখন কম ব্যবহৃত)

### JSX সিনট্যাক্স
• জাভাস্ক্রিপ্টে লেখা HTML-এর মতো সিনট্যাক্স
• অবশ্যই একটি একক প্যারেন্ট এলিমেন্ট রিটার্ন করতে হবে
• অতিরিক্ত DOM নোড এড়াতে React fragments (\`<>\`) ব্যবহার করুন

### Props
• প্যারেন্ট থেকে চাইল্ড কম্পোনেন্টে ডেটা পাস করতে ব্যবহৃত
• শুধুমাত্র পঠনযোগ্য বৈশিষ্ট্য
• কম্পোনেন্ট পুনঃব্যবহারযোগ্যতা সক্ষম করে

### স্টেট ম্যানেজমেন্ট
• কম্পোনেন্টকে অভ্যন্তরীণ ডেটা পরিচালনা করতে দেয়
• ফাংশনাল কম্পোনেন্টে \`useState\` হুক ব্যবহার করুন
• স্টেট আপডেট পুনরায় রেন্ডার ট্রিগার করে

### ইভেন্ট হ্যান্ডলিং
• HTML-এর মতো কিন্তু camelCase নামকরণ ব্যবহার করে
• উদাহরণ: \`onClick\`, \`onChange\`, \`onSubmit\`
• ইভেন্ট হ্যান্ডলার সঠিকভাবে বাইন্ড করতে মনে রাখবেন

## সেরা অনুশীলন
• কম্পোনেন্টকে ছোট এবং কেন্দ্রীভূত রাখুন
• বর্ণনামূলক কম্পোনেন্ট নাম ব্যবহার করুন
• লজিক থেকে প্রেজেন্টেশন আলাদা করুন
• দক্ষতা উন্নতির জন্য নিয়মিত অনুশীলন করুন

## পরবর্তী ধাপ
• সহজ কম্পোনেন্ট তৈরি করুন
• props এবং state নিয়ে অনুশীলন করুন
• কম্পোনেন্ট লাইফসাইকেল সম্পর্কে শিখুন
• উন্নত প্যাটার্ন অন্বেষণ করুন`;
};

// Real implementation would look like this:
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSummary = async (transcript, language = 'English') => {
  try {
    const prompt = language === 'Bengali' 
      ? `নিম্নলিখিত ভিডিও ট্রান্সক্রিপ্টটিকে একটি সংক্ষিপ্ত, স্পষ্ট নোটে সংক্ষিপ্ত করুন যা শিক্ষার্থীদের জন্য উপযুক্ত। বুলেট পয়েন্ট, ব্যাখ্যা এবং উদাহরণ ব্যবহার করুন। বাংলায় অনুবাদ করুন:\n\n${transcript}`
      : `Summarize this video transcript into a concise, clear note for students. Use bullet points, explanations, and examples. Format it nicely with headers and subheadings:\n\n${transcript}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};
*/
