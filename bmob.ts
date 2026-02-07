
// Initialize Bmob
// The SDK is loaded via <script> tag in index.html to ensure stability in browser environments
const Bmob = (window as any).Bmob;

// TODO: REPLACE THESE WITH YOUR KEYS FROM BMOB CONSOLE
const SECRET_KEY = 'YOUR_SECRET_KEY';
const API_KEY = 'YOUR_API_KEY';

Bmob.initialize(SECRET_KEY, API_KEY);

export default Bmob;
