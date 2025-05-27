# Football Field Booking App

A full-stack web application for booking football fields. This application allows users to view available football fields, check availability, and make bookings.

## Features

- 🔐 User authentication (register, login, logout)
- 🏟️ Browse available football fields
- 📅 Check field availability on different dates
- ⏱️ Book fields for specific time slots
- 💲 View pricing information
- 🌙 Light/Dark theme toggle
- 🌐 Internationalization support (English, Thai)
- 📱 Responsive design for mobile and desktop

## Technologies

### Backend
- **Framework**: NestJS (TypeScript-based)
- **Database**: SQLite (via TypeORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React (with TypeScript)
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Internationalization**: i18next
- **Date Handling**: date-fns
- **UI Components**: react-modal, lucide-react

## Project Structure

```
football-field-booking-app/
├── backend/                   # NestJS server application
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── booking/           # Booking module
│   │   ├── field/             # Field module
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── entities/          # TypeORM entities
│   │   ├── app.module.ts      # Main application module
│   │   ├── main.ts            # Application entry point
│   │   └── seed.ts            # Database seeding script
│   └── package.json           # Backend dependencies
├── frontend/                  # React client application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── i18n/              # Internationalization
│   │   │   └── locales/       # Translation files
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   └── App.tsx            # Main application component
│   └── package.json           # Frontend dependencies
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/football-field-booking-app.git
cd football-field-booking-app
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run start:dev
```

2. Start the frontend development server
```bash
cd ../frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### Database Seeding

To populate the database with initial data:
```bash
cd backend
npm run seed
```

## API Endpoints

- **Authentication**
  - POST `/auth/register` - Register a new user
  - POST `/auth/login` - Login and receive JWT token

- **Fields**
  - GET `/field` - Get all fields
  - GET `/field/:id` - Get field details

- **Bookings**
  - GET `/booking` - Get user bookings
  - POST `/booking` - Create a new booking
  - GET `/booking/availability/:fieldId/:date` - Check field availability

## Author

Thanatat Sincharoen

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
