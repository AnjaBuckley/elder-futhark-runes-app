# Elder Futhark Runes Learning App

An interactive web application for learning the Elder Futhark runic alphabet, featuring AI-powered chat assistance through OpenAI integration.

<img width="1346" alt="Screenshot 2025-03-08 at 12 40 29" src="https://github.com/user-attachments/assets/5791259f-86c0-4756-9c53-f97dc09d357c" />

## Live Demo

Try the app live at: [https://elder-futhark-runes-app.vercel.app](https://elder-futhark-runes-app.vercel.app)

## Features

- **AI-Powered Chat Interface**: Ask questions about runes and get informative responses powered by OpenAI
- **Interactive Learning Cards**: Flip cards showing all 24 Elder Futhark runes with their meanings and Latin equivalents
- **Drawing Test**: Practice drawing runes and get AI-powered feedback on your attempts

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI Integration**: OpenAI API (GPT-3.5 Turbo for chat, GPT-4o for drawing evaluation)
- **Animations**: CSS transitions for card flips and UI elements
- **Hosting**: Vercel for seamless deployment

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/AnjaBuckley/elder-futhark-runes-app.git
   cd elder-futhark-runes-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

This application is deployed on Vercel. To deploy your own version:

1. Fork this repository
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel` from the project directory
4. Follow the prompts to set up your project
5. Add your OpenAI API key as an environment variable

## How to Use

### Home Page
- Type questions about Elder Futhark runes in the chat interface
- Click on example prompts for quick information
- Use the "Start Learning Runes" button to navigate to the learning section

### Learning Page
- Browse through all 24 Elder Futhark runes
- Click on any card to flip it and reveal details about the rune
- Learn the name, Latin equivalent, and meaning of each rune

### Test Page
- Practice drawing runes with your mouse or finger
- Submit your drawing for evaluation
- Receive AI-powered feedback on your drawing accuracy
- Click "Next Rune" to practice another random rune

## Future Enhancements

- User accounts to track learning progress
- Audio pronunciation of rune names
- Mobile app version
- Expanded historical context and usage examples

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Information about Elder Futhark runes sourced from historical texts and academic resources
- OpenAI for providing the API that powers the chat functionality and drawing evaluation
- Vercel for hosting the application
- All contributors and testers who helped improve this application
