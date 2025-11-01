# ActivePulse Fitness Application

ActivePulse is a comprehensive fitness management system designed to help users track their workouts, join classes, and maintain their fitness journey.

## Features

- User Authentication and Authorization
- Workout Tracking and Management
- Class Scheduling and Booking
- Progress Tracking and Analytics
- Admin Dashboard
- Real-time Notifications
- Social Features and Achievements

## Tech Stack

- Frontend: React.js
- Backend: Node.js & Express
- Database: MongoDB
- Authentication: JWT
- Real-time: Socket.io
- File Storage: Cloudinary
- Containerization: Docker

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/activepulse.git
   ```

2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   # Start both client and server
   npm run dev
   ```

### Docker Setup

To run the application using Docker:

```bash
docker-compose up --build
```

## Project Structure

```
ActivePulse/
├── client/                 # React Frontend
├── server/                 # Node.js Backend
├── docs/                   # Documentation
├── scripts/               # Utility Scripts
└── .github/               # GitHub Workflows
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to all contributors
- Inspired by modern fitness applications
- Built with love for the fitness community