# Wanderlust - Airbnb Clone Application

A full-stack web application built with **Node.js**, **Express.js**, and **MongoDB** that allows users to list accommodations, browse properties, and leave reviews. This is an Airbnb-like platform with authentication, authorization, and real-time geolocation features.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Routes](#api-routes)
- [Middleware & Security](#middleware--security)
- [Controllers](#controllers)
- [Running the Application](#running-the-application)
- [Project Dependencies](#project-dependencies)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

**Wanderlust** is a full-stack accommodation listing and booking platform. It enables users to:
- Register and authenticate using Passport.js
- Create, read, update, and delete (CRUD) property listings
- Upload property images using Cloudinary
- Leave reviews and ratings on properties
- View property locations on an interactive map using Mapbox
- Manage their listings with proper authorization checks

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20.17.0
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.18.0
- **Authentication**: Passport.js with Local Strategy
- **Session Management**: express-session with MongoDB Store (connect-mongo)
- **Validation**: Joi 18.0.1

### Frontend
- **Templating Engine**: EJS with ejs-mate
- **Styling**: Bootstrap (CSS Framework)
- **Maps**: Mapbox for geolocation features

### File & Media Management
- **File Upload**: Multer 2.0.2
- **Cloud Storage**: Cloudinary with multer-storage-cloudinary
- **HTTP Client**: Axios 1.12.2

### Development Tools
- **Environment Variables**: Dotenv 17.2.3
- **HTTP Method Override**: method-override 3.0.0

---

## Features

### Core Features
✅ **User Authentication & Authorization**
- User registration with email and password
- Secure login/logout with Passport.js
- Session management with MongoDB store
- Role-based access control (Owner only can edit/delete listings)

✅ **Listing Management**
- Create new property listings with title, description, location, price
- Upload and store images on Cloudinary
- Edit and update existing listings
- Delete listings (Owner only)
- View all listings with pagination support
- Individual listing detail pages

✅ **Review System**
- Leave reviews with comments and ratings (1-5 stars)
- View all reviews on a listing
- Delete reviews (Author only)
- Review author tracking with user references

✅ **Geolocation & Maps**
- Geocode listing locations using MapTiler API
- Store geographic coordinates (GeoJSON format) with listings
- Display locations on interactive maps
- Support for GPS coordinates

✅ **Flash Messages**
- Success messages for user actions
- Error messages for validation failures
- Persistent flash notifications across requests

---

## Project Structure

```
MAJORPROJECT/
├── app.js                          # Main Express application entry point
├── package.json                    # Project dependencies
├── schema.js                       # Joi validation schemas
├── cloudConfig.js                  # Cloudinary configuration
├── middleware.js                   # Custom middleware functions
│
├── controllers/                    # Business logic for routes
│   ├── listing.js                  # Listing CRUD operations
│   ├── review.js                   # Review operations
│   └── user.js                     # User authentication & management
│
├── routes/                         # Express route handlers
│   ├── listing.js                  # Listing routes (/listings)
│   ├── review.js                   # Review routes (/listings/:id/reviews)
│   └── user.js                     # User routes (/signup, /login, /logout)
│
├── models/                         # MongoDB Mongoose schemas
│   ├── listing.js                  # Listing schema with references
│   ├── review.js                   # Review schema with author reference
│   └── user.js                     # User schema with Passport support
│
├── utils/                          # Utility functions
│   ├── ExpressError.js             # Custom error handling class
│   └── wrapAsync.js                # Async error wrapper middleware
│
├── init/                           # Database initialization
│   ├── index.js                    # Initialization script entry point
│   └── data.js                     # Sample listing data
│
├── public/                         # Static files (CSS, JS, images)
│   ├── css/                        # Custom stylesheets
│   └── js/                         # Client-side JavaScript
│
├── views/                          # EJS template files
│   ├── layouts/
│   │   └── boilerplate.ejs         # Main layout template
│   ├── includes/
│   │   ├── navbar.ejs              # Navigation bar component
│   │   └── flash.ejs               # Flash message component
│   ├── listings/
│   │   ├── index.ejs               # All listings page
│   │   ├── new.ejs                 # Create new listing form
│   │   ├── show.ejs                # Single listing details page
│   │   └── edit.ejs                # Edit listing form
│   ├── users/
│   │   ├── login.ejs               # Login form
│   │   └── signup.ejs              # Registration form
│   └── error.ejs                   # Error page
│
├── .env                            # Environment variables (not in repo)
├── .gitignore                      # Git ignore file
└── .git/                           # Git repository
```

---

## Installation & Setup

### Prerequisites
- Node.js 20.17.0 or higher
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for image uploads
- Mapbox/MapTiler API key for geolocation

### Step 1: Clone & Install Dependencies
```bash
cd MAJORPROJECT
npm install
```

### Step 2: Create .env File
Create a `.env` file in the project root:
```bash
# Database
ATLASDB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wanderlust

# Session
SECRET=your_session_secret_key

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

# Maps
MAP_TOKEN=your_mapbox_or_maptiler_token

# Environment
NODE_ENV=development
```

### Step 3: Initialize Database (Optional)
To seed sample data:
```bash
node init/index.js
```

### Step 4: Start the Application
```bash
npm start
# or with nodemon for development
nodemon app.js
```

The application will start on `http://localhost:8080`

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ATLASDB_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `SECRET` | Session encryption secret | `your_secret_key_here` |
| `CLOUDINARY_NAME` | Cloudinary account name | `your_cloudinary_name` |
| `CLOUDINARY_KEY` | Cloudinary API key | `xxxxxxxxxxxxx` |
| `CLOUDINARY_SECRET` | Cloudinary API secret | `xxxxxxxxxxxxx` |
| `MAP_TOKEN` | Mapbox/MapTiler API token | `pk.xxxxxxxxxxxx` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## Database Models

### Listing Schema
```javascript
{
  title: String (required),
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [ObjectId] // References to Review documents
  owner: ObjectId,    // Reference to User document
  geometry: {         // GeoJSON format
    type: "Point",
    coordinates: [longitude, latitude]
  }
}
```

### Review Schema
```javascript
{
  comment: String,
  rating: Number (1-5),
  createdAt: Date (default: now),
  author: ObjectId // Reference to User document
}
```

### User Schema
```javascript
{
  email: String (required),
  username: String (added by passport-local-mongoose),
  password: String (hashed by passport-local-mongoose)
}
```

**Database Relationships:**
- User → Listing (1 to Many) - One user can create multiple listings
- Listing → Review (1 to Many) - One listing can have multiple reviews
- User → Review (1 to Many) - One user can write multiple reviews

---

## API Routes

### Listing Routes (`/listings`)

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/listings` | Get all listings | No |
| GET | `/listings/new` | Show create listing form | Yes |
| POST | `/listings` | Create new listing | Yes |
| GET | `/listings/:id` | Get listing details | No |
| GET | `/listings/:id/edit` | Show edit listing form | Yes (Owner) |
| PUT | `/listings/:id` | Update listing | Yes (Owner) |
| DELETE | `/listings/:id` | Delete listing | Yes (Owner) |

### Review Routes (`/listings/:id/reviews`)

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/listings/:id/reviews` | Create review | Yes |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete review | Yes (Author) |

### User Routes (`/`)

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/signup` | Show signup form | No |
| POST | `/signup` | Register new user | No |
| GET | `/login` | Show login form | No |
| POST | `/login` | Authenticate user | No |
| GET | `/logout` | Logout user | Yes |

---

## Middleware & Security

### Custom Middleware (middleware.js)

**`isLoggedIn`**
- Checks if user is authenticated
- Redirects to login if not
- Used on protected routes

**`isOwner`**
- Verifies user is the listing owner
- Prevents unauthorized edits/deletes
- Compares user ID with listing owner ID

**`isReviewAuthor`**
- Verifies user is the review author
- Prevents unauthorized review deletion
- Compares user ID with review author ID

**`saveRedirectUrl`**
- Stores original URL for post-login redirect
- Allows users to return to intended page after login

**`validateListing`**
- Validates listing data using Joi schema
- Checks required fields and data types
- Returns 400 error if validation fails

**`validateReview`**
- Validates review data using Joi schema
- Ensures rating is 1-5 and comment exists
- Returns 400 error if validation fails

### Error Handling
- **Custom ExpressError Class** - Structured error handling
- **Async Wrapper** - wrapAsync() catches promises rejections
- **Global Error Handler** - Centralized error response

---

## Controllers

### Listing Controller (`controllers/listing.js`)

**`index()`** - Display all listings
**`renderNewForm()`** - Show create listing form
**`createListing()`** - Create new listing with image upload & geocoding
**`showListing()`** - Display listing details with populated reviews
**`renderEditForm()`** - Show edit listing form
**`updateListing()`** - Update listing details
**`deleteListing()`** - Delete listing and associated reviews

### User Controller (`controllers/user.js`)

**`renderSignUpForm()`** - Show registration form
**`signup()`** - Register new user with validation
**`renderLoginForm()`** - Show login form
**`login()`** - Authenticate user and redirect
**`logout()`** - Logout user and destroy session

### Review Controller (`controllers/review.js`)

**`createReview()`** - Add review to listing
**`destroyReview()`** - Delete review from listing

---

## Running the Application

### Development Mode (with nodemon)
```bash
nodemon app.js
```
The server will restart automatically on file changes.

### Production Mode
```bash
NODE_ENV=production node app.js
```

### Port
- Server runs on `http://localhost:8080`

### Features on Startup
1. Loads environment variables from `.env`
2. Connects to MongoDB Atlas/local database
3. Initializes Passport authentication
4. Sets up session store in MongoDB
5. Configures view engine (EJS) and static files
6. Starts HTTP server on port 8080

### Common Issues & Solutions

**MongoDB Connection Error**
```
Error: querySrv ENOTFOUND
```
- Add your IP to MongoDB Atlas whitelist
- Verify connection string in .env
- Check internet connectivity

**Cloudinary Upload Error**
- Verify Cloudinary credentials in .env
- Check API key and secret are correct

**Map Not Displaying**
- Ensure MAP_TOKEN is valid
- Check MapTiler/Mapbox API limits

---

## Project Dependencies

### Production Dependencies
- **express** (5.1.0) - Web framework
- **mongoose** (8.18.0) - MongoDB ODM
- **ejs** (3.1.10) - Template engine
- **passport** (0.7.0) - Authentication
- **express-session** (1.18.2) - Session management
- **multer** (2.0.2) - File uploads
- **cloudinary** (1.21.0) - Image cloud storage
- **joi** (18.0.1) - Data validation
- **axios** (1.12.2) - HTTP client
- **@mapbox/mapbox-sdk** (0.16.2) - Maps API

---

## Features Breakdown

### Authentication System
- Passport.js Local Strategy
- Encrypted password storage
- Session-based authentication
- Secure logout functionality
- Redirect URL management

### Image Management
- Multer for handling form uploads
- Cloudinary integration for cloud storage
- Image optimization (thumbnail generation)
- Filename tracking in database

### Geocoding System
- MapTiler API integration
- Location-to-coordinates conversion
- GeoJSON storage in MongoDB
- Map display on listing pages

### Validation & Security
- Joi schema validation
- Password hashing (Passport)
- CSRF protection potential
- XSS prevention through EJS
- SQL injection prevention (MongoDB)

### User Experience
- Flash messages (success/error)
- Form validation with feedback
- User session persistence
- Responsive navbar with auth status
- Auto-redirect to intended page after login

---

## Future Enhancements

### Potential Features
- [ ] Payment integration (Stripe/PayPal)
- [ ] Booking calendar system
- [ ] Advanced search & filters
- [ ] User profile pages
- [ ] Favorites/Wishlist
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Property category filters
- [ ] Image gallery lightbox
- [ ] Guest messaging system
- [ ] Responsive mobile design improvements
- [ ] API documentation (Swagger)
- [ ] Unit & integration tests
- [ ] GraphQL API

### Performance Optimizations
- [ ] Image lazy loading
- [ ] Pagination for listings
- [ ] Caching strategies
- [ ] Database indexing
- [ ] CDN for static assets
- [ ] Minification & compression

---

## Author

**Arghya** - Creator of Wanderlust Application

---

## License

ISC License

---

## Support

For issues or questions, please check:
1. MongoDB Atlas connection settings
2. Environment variables configuration
3. Cloudinary API credentials
4. Mapbox/MapTiler API access

---

**Last Updated**: December 2025  
**Node Version**: 20.17.0  
**Project Status**: Active Development
