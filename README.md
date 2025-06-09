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

### 2. ⚙️ Set Up Google OAuth 2.0 and Environment Variables

To enable Google Login and Google Drive integration, you first need to set up Google OAuth credentials and then configure your environment variables.

#### 🧩 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and sign in.
2. Click `Select a project` → `New Project`, give it a name (e.g., PDFViewer), and click `Create`.
3. Navigate to **APIs & Services > Library**, search for **Google Identity Services API**, and click **Enable**.
4. Go to **APIs & Services > Credentials**, click `+ CREATE CREDENTIALS` → `OAuth client ID`.

   - If prompted, configure the OAuth consent screen first.
   - Choose **Web Application** as the application type.
   - Set a name (e.g., PDFViewer Web Client).
   - Under **Authorized redirect URIs**, add:
     ```
     http://localhost:3000/api/v1/auth/google/callback
     ```
   - Click **Create** and copy the `Client ID` and `Client Secret`.

5. Set up the **OAuth consent screen**:
   - Choose **External** for the user type.
   - Fill in required information (app name, support email, developer contact).
   - (Optional) Skip scopes or leave them as default.
   - In the **Test users** tab, add your own Google email for testing.

#### 🧪 Configure Environment Variables

Create two `.env` files—one in the `client/` folder and one in the `server/` folder—and add the following environment variables:

##### a) Client (`client/.env`)

```env
# Google OAuth
VITE_GOOGLE_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key
```

##### b) Server (`server/.env`)

```env
# Database configuration (MongoDB)
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/mydatabase

# JWT secret keys for authentication
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_KEY=your_jwt_refresh_key
JWT_INVITATION_KEY=your_jwt_invitation_key
JWT_VERIFICATION_KEY=your_jwt_verification_key
JWT_EXPIRED=30m

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET_CODE=your_google_client_secret
GOOGLE_API_KEY=your_google_api_key

# Email service configuration
EMAIL_HOST=your_email_host
EMAIL_PASSWORD=your_app_password

# Cloudinary configuration (for document storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server port and environment
PORT=3000
NODE_ENV=development
```

---

### 4. 📦 Install Dependencies

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

### 5. 🔄 Run the App

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
