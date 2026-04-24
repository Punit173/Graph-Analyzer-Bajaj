# Graph Analyzer - Full Stack Project

## Overview
A full stack web application to process hierarchical node relationships and return structured insights. Built with Node.js/Express (Backend) and React (Frontend).

## Features
- Directed Graph validation, duplicate and multi-parent handling.
- Tree and Cycle components detection.
- Longest path (depth) calculation.
- Responsive, modern React dark-mode UI with Vite and Tailwind CSS.
- RESTful JSON API.

## Requirements
- Node.js LTS
- npm

## Folder Structure
```
.
├── backend
│   ├── index.js      # Main Express API Server
│   ├── package.json  # Dependencies (express, cors)
├── frontend
│   ├── src
│   │   ├── App.jsx   # Main React component
│   │   ├── index.css # Tailwind & UI CSS
│   │   └── main.jsx  # React bootstrapper
│   ├── index.html    # Vite entry HTML
│   ├── vite.config.js# Vite + Tailwind compiler setup
│   └── package.json  # Frontend Dependencies
└── README.md
```

## Running the app locally

**1. Start the Backend:**
```bash
cd backend
npm install
npm start
```

**2. Start the Frontend:**
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

## Sample Test Cases

**Test Case 1: Valid Normal Tree**
Input: `A->B, A->C, B->D`
Expect: 1 valid tree, Depth 3, Root A

**Test Case 2: Handled Errors & Duplicates**
Input: `A->B, hello, A-b, A->B, B->D, 1->2`
Expect: Tree Depth 3 Root A. Invalid: hello, A-b, 1->2. Duplicate: A->B.

**Test Case 3: Cycles**
Input: `A->B, B->C, C->A`
Expect: 1 Cycle, Largest Root: -, depth: null

**Test Case 4: Multiple Trees with multi-parent handling**
Input: `A->B, C->B, F->G`
Expect: 
- Two trees: Root A (B receives parent A, C->B ignored), Root F.
- Largest Tree Root: A (Tie broken by lex min)

## Deployment Instructions

### Backend (Render/Vercel)
- Create a new web service on Render pointing to the `/backend` folder.
- Ensure the start command is `node index.js`.
- It will automatically bind to `process.env.PORT`.

### Frontend (Vercel)
- Create a new project on Vercel importing the `/frontend` folder.
- Build command: `npm run build`
- Output directory: `dist`
- Change `http://localhost:4000/bfhl` in `App.jsx` to your backend deployed URL.
