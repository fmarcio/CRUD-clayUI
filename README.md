# Clay UI CRUD Manager

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://fmarcio.github.io/CRUD-clayUI/)

A modern, responsive CRUD (Create, Read, Update, Delete) application built to explore **[Clay UI](https://clayui.com/)** components and advanced React patterns.

## 🚀 Live Deployment
The application is live and can be accessed here:
**[https://fmarcio.github.io/CRUD-clayUI/](https://fmarcio.github.io/CRUD-clayUI/)**

---

## 📖 Overview

This project serves as a practical demonstration of integrating **Liferay's Clay UI** system within a React application. It manages various resources (Posts, Comments, Todos) fetched from the **[JSONPlaceholder API](https://jsonplaceholder.typicode.com/)**.

While the application appears simple, it leverages professional-grade state management and architectural patterns to ensure scalability and maintainability.

## ✨ Key Features

- **Resource Management:** Browse and interact with different resource types (Posts, Comments, Todos).
- **Advanced State Management:** Utilizes `useReducer` and `useContext` for robust, centralized state handling.
- **Responsive UI:** Built with Clay UI components for a consistent, accessible, and professional look.
- **Pagination:** Efficiently handles large datasets with built-in pagination support.
- **Form Handling:** Integrated modals and forms for resource manipulation.
- **Testing:** Comprehensive unit tests using Jest and React Testing Library.

## 🛠️ Built With

- **React 16.14** - UI library
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **Clay UI** - Liferay's design system components
- **Tailwind CSS** - Utility-first CSS framework
- **Jest & React Testing Library** - Testing suite

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fmarcio/CRUD-clayUI.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CRUD-clayUI
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

### Running Tests

Execute the unit test suite:
```bash
npm run test
```

### Building for Production

Create a production build:
```bash
npm run build
```
