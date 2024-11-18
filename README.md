# 🚗 Vroomify - Car Management Application

A full-stack application for managing car listings with image upload capabilities, user authentication, and comprehensive search functionality.

## 🌐 Live Demo

- Frontend: [https://vroomify-client.vercel.app/](https://vroomify-client.vercel.app/)
- Backend: [https://vroomify.vercel.app/](https://vroomify.vercel.app/)
- API Documentation: [https://vroomify-client.vercel.app/api/docs](https://vroomify-client.vercel.app/api/docs)

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js & Express.js
- MongoDB for database
- JWT for authentication
- Pinata for IPFS image storage
- SendGrid for email notifications

## 🚀 Features

- **User Authentication**: Secure signup and login functionality
- **Car Management**: 
  - Create cars with up to 10 images
  - Add title, description, and tags
  - Update car details
  - Delete cars
- **Search Functionality**: Global search across all cars (title, description, tags)
- **Personal Dashboard**: View and manage your car listings
- **Responsive Design**: Works seamlessly on desktop and mobile

## 💻 Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB account
- Pinata account for IPFS
- SendGrid account for email services

### Environment Variables

Create a `.env` file in the server directory with the following:

```env
DB_CONNECTION_STRING=your_mongodb_connection_string
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt
JWT_SECRET=your_jwt_secret
MAILER_PASS=your_mailer_password
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Getting the API Keys

1. **MongoDB Connection String**:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
   - Create a cluster and get your connection string

2. **Pinata Credentials**:
   - Register at [Pinata](https://www.pinata.cloud/)
   - Get API key and secret from dashboard

3. **SendGrid API Key**:
   - Create account at [SendGrid](https://sendgrid.com/)
   - Generate API key from Settings

### Running the Application

1. **Backend Setup**:
```bash
cd server
npm install
nodemon index.js
```

2. **Frontend Setup**:
```bash
cd client
npm install
npm run dev
```

## 📝 API Documentation

For detailed API documentation, visit [https://vroomify-client.vercel.app/api/docs](https://vroomify-client.vercel.app/api/docs)


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👨‍💻 Author

- [Shubham Patel](https://github.com/ShubhamPatel2305)
