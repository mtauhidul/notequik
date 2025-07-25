import axios from 'axios';

// Utility function to extract video ID from YouTube URL
export const extractVideoId = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Function to get YouTube transcript using RapidAPI
export const getYouTubeTranscript = async (videoId) => {
  console.log(`Fetching transcript for video: ${videoId}`);
  
  const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
  const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
  
  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
    throw new Error('RapidAPI configuration missing. Please check your environment variables.');
  }

  try {
    const options = {
      method: 'GET',
      url: 'https://youtube-transcripts.p.rapidapi.com/youtube/transcript',
      params: {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId: videoId,
        chunkSize: '500',
        text: 'false',
        lang: 'en'
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    
    console.log('RapidAPI Response:', response.data);

    // Check if we have transcript data in the content array
    if (response.data && response.data.content && Array.isArray(response.data.content)) {
      const transcriptText = response.data.content
        .map(item => item.text || item.content || '')
        .join(' ')
        .trim();
      
      if (transcriptText) {
        console.log(`Successfully fetched transcript: ${transcriptText.length} characters`);
        return transcriptText;
      }
    }

    // If no transcript found, throw an error
    throw new Error('No transcript available for this video');

  } catch (error) {
    console.error('Transcript fetch error:', error);
    
    // Handle RapidAPI specific errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;
      
      if (status === 401) {
        throw new Error('Invalid RapidAPI key. Please check your configuration.');
      } else if (status === 403) {
        throw new Error('RapidAPI access forbidden. Please check your subscription.');
      } else if (status === 429) {
        throw new Error('Too many requests. Please wait a moment before trying again.');
      } else if (status === 404) {
        throw new Error('Transcript not found for this video. The video may not have captions available.');
      } else {
        throw new Error(message || `API error: ${status}`);
      }
    }
    
    // Network or connection errors
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    
    // Default error
    throw new Error(error.message || 'Failed to fetch transcript. Please try again.');
  }
};
