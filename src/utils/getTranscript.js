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
    // Since we can't directly access YouTube's API from frontend due to CORS,
    // we'll use a proxy service or backend endpoint
    // For now, we'll simulate the transcript data

    // In a real implementation, you would either:
    // 1. Use a backend service to fetch the transcript
    // 2. Use a proxy service like youtube-transcript-api
    // 3. Implement your own scraping solution

    // For demo purposes, we'll return a mock transcript
    const mockTranscript = `
      Welcome to this tutorial. Today we'll be learning about React components.
      React components are the building blocks of any React application.
      They allow you to split the UI into independent, reusable pieces.
      There are two main types of components: functional and class components.
      Functional components are simpler and are the recommended approach.
      Let's start by creating our first component.
      We'll use JSX syntax to define our component structure.
      JSX allows us to write HTML-like syntax in our JavaScript code.
      Remember to always return a single parent element from your component.
      You can use React fragments if you don't want to add extra DOM nodes.
      Props are used to pass data from parent to child components.
      State allows components to manage their own internal data.
      Use the useState hook for managing state in functional components.
      Event handling in React is similar to HTML but uses camelCase naming.
      Always remember to bind your event handlers properly.
      That's a basic overview of React components. Keep practicing!
    `;

    return mockTranscript;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error(
      "Failed to fetch video transcript. Please check the video URL and try again."
    );
  }
};

// Real implementation would look like this (requires backend):
/*
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
*/
