const readline = require('readline');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'; // API endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // API key from environment variable

// Set up readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to send message to Gemini AI
const sendMessage = async (message) => {
    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [
                {
                    parts: [
                        {
                            text: message
                        }
                    ]
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Extract and format the response
        const candidates = response.data.candidates;
        if (candidates && candidates.length > 0) {
            const candidate = candidates[0];
            const content = candidate.content || 'No content available';
            console.log('AI Response:', content);
        } else {
            console.log('No candidates found in the response.');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

// Function to prompt user input
const promptUser = () => {
    rl.question('You: ', async (input) => {
        await sendMessage(input);
        promptUser();
    });
};

// Start prompting user
promptUser();
