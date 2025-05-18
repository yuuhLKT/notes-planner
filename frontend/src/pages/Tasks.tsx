import { useEffect, useState } from 'react'
import Header from '../components/Header'
import TaskCard from '../components/TaskCard'
import TaskViewModal from '../components/TaskViewModal'
import { groupService } from '../services/groupService'
import { taskService } from '../services/taskService'
import type { Group, Task } from '../types'

export default function Tasks() {
    const [personalTasks, setPersonalTasks] = useState<Task[]>([])
    const [groupTasks, setGroupTasks] = useState<Task[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState<{
        title: string
        description: string
        group: string
        status: Task['status']
    }>({
        title: '',
        description: '',
        group: '',
        status: 'pending',
    })
    const [viewingTask, setViewingTask] = useState<Task | null>(null)

    const userId = localStorage.getItem('userId') || ''

    useEffect(() => {
        loadTasks()
        loadGroups()
    }, [])

    const loadTasks = async () => {
        if (!userId) return
        const tasks = await taskService.getUserTasks(userId)
        setPersonalTasks(tasks.filter((task) => !task.group))
        setGroupTasks(tasks.filter((task) => task.group))
    }

    const loadGroups = async () => {
        const data = await groupService.getGroups()
        setGroups(data.filter((g) => g.users?.some((u) => u._id === userId)))
    }

    const handleOpenModal = (task?: Task) => {
        if (task) {
            setSelectedTask(task)
            setForm({
                title: task.title,
                description: task.description,
                group: task.group?._id || '',
                status: task.status,
            })
            setIsEditing(true)
        } else {
            setSelectedTask(null)
            setForm({
                title: '',
                description: '',
                group: '',
                status: 'pending',
            })
            setIsEditing(false)
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedTask(null)
        setForm({ title: '', description: '', group: '', status: 'pending' })
        setIsEditing(false)
    }

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (isEditing && selectedTask) {
                await taskService.updateTask(selectedTask._id, {
                    title: form.title,
                    description: form.description,
                    status: form.status,
                    group: form.group || undefined,
                })
            } else {
                await taskService.createTask({
                    title: form.title,
                    description: form.description,
                    status: form.status,
                    ...(form.group ? {} : { user: userId }),
                    group: form.group || undefined,
                })
            }
            handleCloseModal()
            loadTasks()
        } catch {
            alert('Erro ao salvar tarefa.')
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Deseja realmente deletar esta tarefa?')) return
        try {
            await taskService.deleteTask(id)
            handleCloseModal()
            loadTasks()
        } catch {
            alert('Erro ao deletar tarefa.')
        }
    }

    const handleOpenViewModal = (task: Task) => {
        setViewingTask(task)
    }

    const handleCloseViewModal = () => {
        setViewingTask(null)
    }

    const handleEditFromView = () => {
        if (viewingTask) {
            setSelectedTask(viewingTask)
            setForm({
                title: viewingTask.title,
                description: viewingTask.description,
                group: viewingTask.group?._id || '',
                status: viewingTask.status,
            })
            setIsEditing(true)
            setShowModal(true)
            setViewingTask(null)
        }
    }

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Nova Tarefa
                    </button>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                        Tarefas Pessoais
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {personalTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onClick={() => handleOpenViewModal(task)}
                            />
                        ))}
                        {personalTasks.length === 0 && (
                            <p className="text-gray-500">
                                Nenhuma tarefa pessoal.
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        Tarefas de Grupos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onClick={() => handleOpenViewModal(task)}
                            />
                        ))}
                        {groupTasks.length === 0 && (
                            <p className="text-gray-500">
                                Nenhuma tarefa de grupo.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal de criar/editar/visualizar tarefa */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
                        </h2>
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded min-h-[80px]"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Grupo (opcional)
                                </label>
                                <select
                                    name="group"
                                    value={form.group}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Tarefa pessoal</option>
                                    {groups.map((g) => (
                                        <option key={g._id} value={g._id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="pending">Pendente</option>
                                    <option value="in_progress">
                                        Em andamento
                                    </option>
                                    <option value="completed">Concluída</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                {isEditing && selectedTask && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(selectedTask._id)
                                        }
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Deletar
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {viewingTask && (
                <TaskViewModal
                    task={viewingTask}
                    onClose={handleCloseViewModal}
                    editButton={
                        <button
                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleEditFromView}
                        >
                            Editar
                        </button>
                    }
                />
            )}
        </>
    )
}
