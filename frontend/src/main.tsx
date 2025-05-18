import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import Groups from './pages/Groups.tsx'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Notes from './pages/Notes.tsx'
import Profile from './pages/Profile.tsx'
import Register from './pages/Register.tsx'
import Tasks from './pages/Tasks.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
