# 📄 PDFViewer Project

## 🚀 Overview

This project is a **PDF Viewer** application with comprehensive features including authentication, document management, annotation, and more. It consists of two parts: **Client** and **Server**.

---

## ✨ Features

- 🔐 **Authentication & Authorization**  
  - Email & Password login  
  - Google OAuth login

- 📚 **Document Management**  
  - View list of uploaded documents  
  - Upload documents from your local machine  
  - Upload documents from third-party sources (Google Drive)

- 🔒 **Document Permissions**  
  - Assign Guest, View-only, or Edit permissions  
  - Invite collaborators via email with configurable access modes (edit/view-only)

- 👓 **Document Interaction**  
  - View and download documents  
  - Annotate with Shape & Free Text annotations

- ⚙️ **Advanced Features**  
  - Document caching for faster load  
  - Multilingual support: English 🇬🇧 and Vietnamese 🇻🇳

---

## 🗂️ Project Structure

```plaintext
pdfviewer/
├── client/                     # Frontend Application
│   ├── src/                    # Source code for the client application (React/Vue/Angular, TypeScript)
│   ├── public/                 # Static assets (e.g., index.html)
│   ├── package.json            # Project information and client dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.ts          # Vite configuration (Build tool)
├── server/                     # Backend Application
│   ├── src/                    # Source code for the server application (NestJS, TypeScript)
│   ├── dist/                   # Compiled source code (JavaScript)
│   ├── package.json            # Project information and server dependencies
│   └── tsconfig.json           # TypeScript configuration
├── .gitignore                  # Files/folders ignored by Git
└── README.md                   # Project overview and documentation

```

## 🛠️ Setup & Run

### 1. 📥 Clone repository

```bash
git clone https://github.com/NCHLong2507/PDFViewer.git
cd PDFViewer
```

### 2. ⚙️ Environment Variables

To ensure the project works correctly, you need to create environment configuration files `.env` for both the server and client with the necessary environment variables.

#### a) Client (`client/.env`)

```env
# Google OAuth
VITE_GOOGLE_ID=your_google_id
VITE_GOOGLE_API_KEY=your_google_api_key
```

#### b) Server (`server/.env`)

```env
# Database configuration (MongoDB)
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/mydatabase

# JWT secret key for authentication
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_KEY=your_jwt_refresh_key
JWT_INVITATION_KEY=your_jwt_invitation_key
JWT_EXPIRED=30m

# Google OAuth (for Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET_CODE=your_google_secret_code
GOOGLE_API_KEY=your_google_api_key

# Email configuration (for sending invites, password resets, etc.)
EMAIL_HOST=your_email_host
EMAIL_PASSWORD=your_app_password

# Cloudinary configuration (for storing documents)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server running port (default 3000)
PORT=3000
NODE_ENV=development
```

---

### 3. 📦 Install Dependencies

#### Using npm:

```bash
npm run install
```

This will execute:

```json
"install": "npm install && npm install --prefix client && npm install --prefix server"
```

#### Using Yarn:

If you prefer `yarn`, you can run:

```bash
yarn install && yarn --cwd client install && yarn --cwd server install
```

Or define in your `package.json`:

```json
"scripts": {
  "install": "yarn install && yarn --cwd client install && yarn --cwd server install"
}
```

Then run:

```bash
yarn install
```

---

### 4. 🔄 Run the App

You can start both frontend and backend in development mode with hot reload:

#### Using npm:

```bash
npm run dev
```

#### Using Yarn:

```bash
yarn dev
```

This will execute the concurrently run:

```json
"dev": "concurrently \"npm run client\" \"npm run server\""
```

Ensure `concurrently` is installed at root.

---

## 💻 Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, NestJS, MongoDB, Mongoose
- **Authentication:** JWT, Google OAuth 2.0
- **File Storage:** Cloudinary
- **Email Service:** Nodemailer with SMTP
- **PDF Viewer & Annotation:** [Apryse WebViewer](https://www.apryse.com/webviewer) – used for rendering PDFs and supporting advanced annotations (shapes, free text, highlights, etc.)
- **Language Support:** i18next

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

---

## 📬 Contact

For support or feedback, feel free to contact **[longnch@dgroup.co](mailto:longnch@dgroup.co)**

---

## 📌 License

This project is licensed under the [MIT License](LICENSE).

