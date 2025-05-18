import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import NoteCard from '../components/NoteCard'
import NoteViewModal from '../components/NoteViewModal'
import TaskCard from '../components/TaskCard'
import TaskViewModal from '../components/TaskViewModal'
import { noteService } from '../services/noteService'
import { taskService } from '../services/taskService'
import type { Note, Task } from '../types'

export default function Home() {
    const [notes, setNotes] = useState<Note[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId') || ''
    const [viewingNote, setViewingNote] = useState<Note | null>(null)
    const [viewingTask, setViewingTask] = useState<Task | null>(null)

    useEffect(() => {
        if (userId) {
            noteService.getUserNotes(userId).then(setNotes)
            taskService.getUserTasks(userId).then(setTasks)
        }
    }, [userId])

    const personalNotes = notes.filter((n) => !n.group)
    const groupNotes = notes.filter((n) => n.group)
    const personalTasks = tasks.filter((t) => !t.group)
    const groupTasks = tasks.filter((t) => t.group)

    const recent = <T extends { updatedAt: string }>(arr: T[]): T[] =>
        arr
            .sort(
                (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
            )
            .slice(0, 3)

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Visão Geral
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Bloco de Tarefas */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Tarefas Recentes
                            </h2>
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => navigate('/tasks')}
                            >
                                Ver todas
                            </button>
                        </div>
                        <h3 className="font-semibold text-gray-700 mt-2 mb-1">
                            Pessoais
                        </h3>
                        <div className="grid grid-cols-1 gap-3 mb-4">
                            {recent(personalTasks).length === 0 && (
                                <span className="text-gray-400 text-sm">
                                    Nenhuma tarefa pessoal.
                                </span>
                            )}
                            {recent(personalTasks).map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onClick={() => setViewingTask(task)}
                                />
                            ))}
                        </div>
                        <h3 className="font-semibold text-gray-700 mt-4 mb-1">
                            De Grupos
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {recent(groupTasks).length === 0 && (
                                <span className="text-gray-400 text-sm">
                                    Nenhuma tarefa de grupo.
                                </span>
                            )}
                            {recent(groupTasks).map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onClick={() => setViewingTask(task)}
                                />
                            ))}
                        </div>
                        <button
                            className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            onClick={() => navigate('/tasks')}
                        >
                            Nova Tarefa
                        </button>
                    </div>
                    {/* Bloco de Notas */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Notas Recentes
                            </h2>
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => navigate('/notes')}
                            >
                                Ver todas
                            </button>
                        </div>
                        <h3 className="font-semibold text-gray-700 mt-2 mb-1">
                            Pessoais
                        </h3>
                        <div className="grid grid-cols-1 gap-3 mb-4">
                            {recent(personalNotes).length === 0 && (
                                <span className="text-gray-400 text-sm">
                                    Nenhuma nota pessoal.
                                </span>
                            )}
                            {recent(personalNotes).map((note) => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    onClick={() => setViewingNote(note)}
                                />
                            ))}
                        </div>
                        <h3 className="font-semibold text-gray-700 mt-4 mb-1">
                            De Grupos
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {recent(groupNotes).length === 0 && (
                                <span className="text-gray-400 text-sm">
                                    Nenhuma nota de grupo.
                                </span>
                            )}
                            {recent(groupNotes).map((note) => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    onClick={() => setViewingNote(note)}
                                />
                            ))}
                        </div>
                        <button
                            className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            onClick={() => navigate('/notes')}
                        >
                            Nova Nota
                        </button>
                    </div>
                </div>
                <div className="text-center text-gray-500 mt-8">
                    <p>
                        Bem-vindo ao Notes Planner! Aqui você pode gerenciar
                        suas tarefas e notas pessoais e de grupo de forma
                        simples e rápida.
                    </p>
                </div>
            </div>
            {viewingNote && (
                <NoteViewModal
                    note={viewingNote}
                    onClose={() => setViewingNote(null)}
                />
            )}
            {viewingTask && (
                <TaskViewModal
                    task={viewingTask}
                    onClose={() => setViewingTask(null)}
                />
            )}
        </>
    )
}
