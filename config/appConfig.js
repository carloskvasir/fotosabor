import Constants from 'expo-constants';

const appConfig = {
    GEMINI_API_URL: Constants.expoConfig?.extra?.geminiApiUrl,
    GEMINI_API_KEY: Constants.expoConfig?.extra?.geminiApiKey
};

export default appConfig;