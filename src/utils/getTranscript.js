// Utility function to extract video ID from YouTube URL
export const extractVideoId = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Function to get YouTube transcript
export const getYouTubeTranscript = async (videoId) => {
  try {
    // Validate video ID
    if (!videoId || videoId.length !== 11) {
      throw new Error("Invalid YouTube video ID");
    }

    // For now, we'll use mock transcript since real API services have CORS issues
    // In production, this should be handled by your backend
    console.log(`Fetching transcript for video: ${videoId}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return getMockTranscript();
    
  } catch (error) {
    console.error("Error fetching transcript:", error);
    
    // Provide more specific error messages
    if (error.message?.includes('Invalid YouTube video ID')) {
      throw new Error("Invalid YouTube URL. Please check the video link and try again.");
    } else {
      throw new Error("Unable to fetch video transcript. Using demo content for now.");
    }
  }
};

// Mock transcript for demo purposes
const getMockTranscript = () => {
  return `
    Welcome to this comprehensive tutorial on modern web development. 
    Today we'll be exploring the fundamentals of building scalable web applications.
    We'll start by understanding the core concepts of frontend and backend development.
    
    First, let's talk about frontend technologies. HTML provides the structure of our web pages.
    CSS is responsible for styling and making our applications visually appealing.
    JavaScript adds interactivity and dynamic behavior to our websites.
    
    Modern frontend frameworks like React, Vue, and Angular have revolutionized web development.
    They provide component-based architecture that makes code more maintainable and reusable.
    React, in particular, has gained massive popularity due to its simplicity and flexibility.
    
    React uses a virtual DOM to efficiently update the user interface.
    Components can be either functional or class-based, with functional components being preferred.
    Props allow you to pass data from parent to child components.
    State management helps you handle dynamic data within components.
    
    Hooks like useState and useEffect have simplified state management in functional components.
    The useEffect hook handles side effects like API calls and subscriptions.
    Custom hooks allow you to reuse stateful logic across multiple components.
    
    On the backend side, we have various technologies like Node.js, Python, Java, and PHP.
    These languages help us build server-side logic, handle databases, and create APIs.
    REST APIs and GraphQL are common ways to structure communication between frontend and backend.
    
    Database management is crucial for any web application.
    We have SQL databases like MySQL and PostgreSQL for structured data.
    NoSQL databases like MongoDB and Firebase are great for flexible, document-based storage.
    
    Authentication and authorization are essential for securing your applications.
    JWT tokens are commonly used for stateless authentication.
    OAuth provides a secure way to integrate with third-party services.
    
    Version control with Git is essential for collaborative development.
    Branching strategies help manage code changes across different features.
    Pull requests enable code review and quality assurance.
    
    Cloud platforms like AWS, Google Cloud, and Vercel make deployment easier than ever.
    Continuous Integration and Continuous Deployment (CI/CD) automate the deployment process.
    Monitoring and logging help you track application performance and errors.
    
    Best practices include writing clean, readable code that follows established conventions.
    Testing your applications ensures reliability and prevents regressions.
    Following security guidelines protects your users and their data.
    
    Performance optimization techniques include code splitting, lazy loading, and caching.
    Responsive design ensures your application works well on all device sizes.
    Accessibility features make your application usable by everyone.
    
    The development ecosystem includes package managers like npm and yarn.
    Build tools like Webpack, Vite, and Parcel optimize your code for production.
    Linting tools like ESLint help maintain code quality and consistency.
    
    Remember to stay updated with the latest trends and continuously learn new technologies.
    Practice building real projects to solidify your understanding.
    The web development ecosystem is constantly evolving, so embrace the learning journey.
    
    Start with small projects and gradually work your way up to more complex applications.
    Join developer communities to learn from others and share your knowledge.
    Contribute to open source projects to gain experience and give back to the community.
    
    Focus on understanding fundamental concepts rather than just memorizing syntax.
    Learn to debug effectively and use browser developer tools.
    Always write documentation for your code to help future maintainers.
    
    Thank you for watching this tutorial. Keep coding and never stop learning!
  `;
};

/* 
Real implementation would require a backend endpoint like this:

export const getYouTubeTranscript = async (videoId) => {
  try {
    const response = await fetch(`/api/transcript/${videoId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transcript');
    }
    const data = await response.json();
    return data.transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
};

Backend endpoint would use youtube-transcript library:
const { YoutubeTranscript } = require('youtube-transcript');

app.get('/api/transcript/:videoId', async (req, res) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(req.params.videoId);
    const text = transcript.map(item => item.text).join(' ');
    res.json({ transcript: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/
