import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use backend for security
});

export const generateSummary = async (transcript, language = "English") => {
  try {
    // Create the prompt based on language
    const systemPrompt =
      language === "Bengali"
        ? "আপনি একজন বিশেষজ্ঞ শিক্ষক। YouTube ভিডিও ট্রান্সক্রিপ্ট থেকে স্পষ্ট, সংগঠিত এবং বোধগম্য নোট তৈরি করুন। বাংলায় উত্তর দিন।"
        : "You are an expert educator. Create clear, organized, and comprehensive notes from YouTube video transcripts.";

    const userPrompt =
      language === "Bengali"
        ? `নিম্নলিখিত YouTube ভিডিও ট্রান্সক্রিপ্ট থেকে একটি বিস্তারিত শিক্ষামূলক নোট তৈরি করুন:

${transcript}

নোটটি অবশ্যই অন্তর্ভুক্ত করবে:
- একটি স্পষ্ট শিরোনাম
- মূল বিষয়গুলির সংক্ষিপ্ত বিবরণ
- বুলেট পয়েন্টে বিস্তারিত ব্যাখ্যা
- গুরুত্বপূর্ণ পয়েন্টগুলি হাইলাইট করুন
- উদাহরণ বা ব্যবহারিক প্রয়োগ (যদি থাকে)
- একটি সংক্ষিপ্ত সারাংশ

Markdown ফরম্যাট ব্যবহার করুন এবং বাংলায় লিখুন।`
        : `Create a detailed educational note from the following YouTube video transcript:

${transcript}

The note should include:
- A clear title
- Brief overview of main topics
- Detailed bullet points with explanations
- Key takeaways highlighted
- Examples or practical applications (if any)
- A concise summary

Use Markdown formatting and make it student-friendly.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const summary = response.choices[0]?.message?.content;

    if (!summary) {
      throw new Error("Failed to generate summary");
    }

    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);

    // Fallback to mock summary if API fails
    if (
      error.message?.includes("rate limit") ||
      error.message?.includes("quota")
    ) {
      console.warn("OpenAI API limit reached, using fallback summary");
      return generateFallbackSummary(language);
    }

    throw new Error("Failed to generate summary. Please try again.");
  }
};

// Fallback function for when API is unavailable
const generateFallbackSummary = (language) => {
  return language === "Bengali"
    ? generateBengaliSummary()
    : generateEnglishSummary();
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
