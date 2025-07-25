import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use backend for security
});

export const generateSummary = async (transcript, language = "English") => {
  try {
    // Create the prompt based on language
    const systemPrompt = language === "Bengali" 
      ? "আপনি একজন বিশেষজ্ঞ শিক্ষক। YouTube ভিডিও ট্রান্সক্রিপ্ট থেকে স্পষ্ট, সংগঠিত এবং বোধগম্য নোট তৈরি করুন। বাংলায় উত্তর দিন।"
      : "You are an expert educator. Create clear, organized, and comprehensive notes from YouTube video transcripts.";

    const userPrompt = language === "Bengali"
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
      : `Create a comprehensive and well-structured educational note from the following YouTube video transcript:

${transcript}

Please format the note with these sections:

# [Clear, Descriptive Title]

## 📝 Executive Summary
A 2-3 sentence overview of what this video covers and its main purpose.

## 🎯 Learning Objectives
What viewers will learn or understand after watching this video (use bullet points).

## 📚 Core Concepts

### [Main Topic 1]
- **Key Point:** Detailed explanation with examples
- **Important Detail:** Supporting information
- **Example:** Real-world application or code example (use \`backticks\` for code/technical terms)

### [Main Topic 2]
- **Key Point:** Detailed explanation with examples  
- **Important Detail:** Supporting information
- **Example:** Real-world application or code example (use \`backticks\` for code/technical terms)

(Continue for all major topics covered)

## 💡 Key Insights & Takeaways
- Most important insights in numbered or bulleted format
- Critical points that viewers should remember
- Actionable advice or recommendations

## 🔗 Practical Applications
How this knowledge can be applied in real scenarios or projects (use bullet points).

## 📊 Summary
A concise recap of the main points covered in 2-3 sentences.

## 🎓 Study Tips
Suggestions for further learning or practice related to this topic (use bullet points).

**CRITICAL FORMATTING REQUIREMENTS:**
- Use \`backticks\` around ALL technical terms, code snippets, class names, function names, etc.
- Ensure proper spacing between sections (double line breaks)
- Use bullet points consistently for lists
- Make headers descriptive, not generic (e.g., "CSS Utility Classes" not "Main Topic 1")
- Keep paragraphs concise and scannable
- Use **bold** for emphasis on key terms
- Include emojis in section headers for visual appeal
- Ensure logical flow and clear hierarchy`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    const summary = response.choices[0]?.message?.content;
    
    if (!summary) {
      throw new Error("Failed to generate summary from OpenAI");
    }

    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    
    // Provide specific error messages for production
    if (error.message?.includes('rate limit')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again in a few minutes.");
    } else if (error.message?.includes('quota')) {
      throw new Error("OpenAI API quota exceeded. Please contact support.");
    } else if (error.message?.includes('invalid_api_key')) {
      throw new Error("Invalid OpenAI API key. Please check configuration.");
    } else {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }
};
