
# 📝 To-Do List – Project Management System

A productivity tool for individuals or teams who want better control over their project workflows using a Kanban-style board with role-based access and real-time updates.

---

## 🚀 Key Features

- User registration and login with JWT authentication
- Create and manage projects
- Manage steps and tasks within projects
- Visual project board for real-time task tracking
- Change status, mark tasks/steps/projects as done
- Email notifications for updates
- Role-based permissions (Viewer, Reviewer, Editor, Owner, Super Owner)
- Invite users into projects
- Filter by name, status, or creation date
- Agile Scrum board interface
- Full Swagger API documentation

---

## 📌 Core Requirements

### 👤 User Management

- Secure authentication (JWT)
- Email verification
- Role-based access control:
  - Viewer
  - Reviewer
  - Editor
  - Owner
  - Super Owner

### 📁 Project Management

- Create, update, and mark projects as completed

### 📑 Step Management

- Create, update, and change step status
- Mark as done
- Add comments

### ✅ Task Management

- Create, update, and change task status
- Mark as done
- Add comments

### 🔔 Notifications

- Email notifications when a project, step, or task is updated

---

## ✅ Current Status

- ✅ All core requirements implemented
- ✅ Fully functional for production use
- ✅ Tests completed for all major features
- ✅ Updated documentation and API specs

---

## 🧰 Tech Stack

### Backend

- **Language**: TypeScript
- **Framework**: Vue
- **UI Library / Component Framework**: Tailwind CSS
- **State Management**: Pinia
- **Build Tool**: Vite
- **Testing**: Jest

### DevOps

- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Kubernetes Deployment**: `kubectl`
- **Environment Management**: `.env` files

---

## 🧪 Testing

- Unit tests using Jest 

---

## 📂 Project Structure

```
.
├── .vscode                  # Configuration files for Visual Studio Code (e.g., workspace settings, extensions, etc.)
├── k8s                      # Contains Kubernetes-related files or configurations
├── public                   # Publicly accessible assets such as images, fonts, favicons, etc.
└── src                       # The main source code of the project
    ├── assets               # Static assets such as images, icons, videos, etc.
    ├── components           # Reusable components in the application (e.g., button, header, footer, etc.)
    ├── composables          # Reusable functions or hooks, typically used in Vue 3 for composable logic (e.g., for reactive state management or business logic)
    ├── layouts              # Contains the main layouts of the application (e.g., page layouts or site-wide UI structure)
    ├── router               # Contains routing configurations for navigation between pages in the application (Vue Router)
    ├── services             # Services such as API calls or other logic related to business processing outside the UI layer
    ├── store                # Contains Vuex or any other state management files for global state handling
    ├── stores               # This folder might contain smaller store modules that manage states for specific features
    ├── types                # TypeScript type definitions (e.g., interfaces, types) used in the project
    ├── utils                # Utility functions or helper tools that can be reused throughout the application
    └── views                # Contains the views or pages of the application (used by Vue Router for page-based routing)
```

---

## 💻 Getting Started

### Prerequisites

- Node.js (v22.x+)
- npm  (v11.3.x+)
- Git
- `kubectl` installed

### Setup Instructions

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project folder
cd [project-folder]

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Start development server
npm run serve

# Build for production
npm run build

# Run production build locally
npm run start
```

---

## 🧪 Development Workflow

### Feature Development

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name develop
   ```

2. Implement your feature and write tests:
   - Use folders like src/components/, src/views/, src/composables/
   - Write corresponding .spec.js or .test.js files in the relevant directories

3. Create a Pull Request:
   - Ensure all tests pass and code is clean
   - Request review and approval before merging

### Code Quality

- **Linting**: eslint --fix (Make sure your code follows the project’s linting rules)
- **Formatting**: prettier --write . (Make sure the code is properly formatted)
- **Type checking**:  If using TypeScript, run tsc --noEmit to check for type errors

### Testing

- Unit & integration testing using Jest or Vue Test Utils

### Deployment

- **CI/CD**: GitHub Actions
- **Deployment**: Kubernetes-compatible using `kubectl`

---

## 🤝 Contributing

1. Fork the repository  
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some amazing feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

---

## 🧭 Contribution Guidelines

- Follow existing code styles and patterns
- Add unit/integration tests for new features
- Update documentation and changelogs as needed

---

## 📜 License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.


---

## 📬 Support

For support, contact the development team or open an issue in the repository.

---

## 🙌 Acknowledgments

Thanks to all contributors who helped build and maintain this project.

---

## 🗺️ Planned Enhancements
1. Capcha for login and register
2. Add feature manager information UI

---
## Front End
If you want contribute back end for app just click it: [Backend](https://github.com/Rangdog/API-TO-DO-LIST)

    
