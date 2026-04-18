🚀 Task Management Web Application

A modern, responsive, and user-friendly Task Management Web App built as part of my internship. This application allows users to efficiently create, organize, and track their daily tasks with a clean and intuitive interface.

📌 Features:

🔐 User Authentication & Authorization
Secure login and registration using JWT
Password hashing with bcrypt
📝 Task Management (CRUD)
Create, update, delete, and view tasks
Track task status (Pending, In Progress, Completed)
Set task priority (Low, Medium, High)
Add due dates
📊 Dashboard
View all tasks in a structured layout
Filter and search tasks
Task statistics overview
⚡ Responsive Design
Fully optimized for mobile, tablet, and desktop
Clean and consistent UI/UX
🔄 Real-Time Updates (Optional)
Instant updates using WebSockets (Socket.IO)
🎨 User Experience Enhancements
Toast notifications
Loading indicators
Smooth UI interactions
Empty state handling
🛠️ Tech Stack
Frontend
React.js
Tailwind CSS / CSS
Axios
Backend
Node.js
Express.js
Database
MongoDB
Authentication
JSON Web Tokens (JWT)
bcrypt
📂 Project Structure
Backend
/server
  /controllers
  /models
  /routes
  /middleware
  /config
Frontend
/client
  /components
  /pages
  /services
  /context
🔌 API Endpoints
Auth Routes
POST /api/auth/register → Register a new user
POST /api/auth/login → Login user
Task Routes
GET /api/tasks → Get all tasks
POST /api/tasks → Create a new task
PUT /api/tasks/:id → Update a task
DELETE /api/tasks/:id → Delete a task
📱 Screenshots
