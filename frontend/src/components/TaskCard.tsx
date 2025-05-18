import { FaCheckCircle, FaHourglassHalf, FaSpinner } from 'react-icons/fa'
import type { Task } from '../types'

interface TaskCardProps {
    task: Task
    onClick?: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    let statusColor = 'bg-gray-200 text-gray-700'
    let statusIcon = <FaHourglassHalf className="inline mr-1" />
    let statusText = 'Pendente'
    if (task.status === 'in_progress') {
        statusColor = 'bg-yellow-100 text-yellow-700'
        statusIcon = <FaSpinner className="inline mr-1 animate-spin" />
        statusText = 'Em andamento'
    } else if (task.status === 'completed') {
        statusColor = 'bg-green-100 text-green-700'
        statusIcon = <FaCheckCircle className="inline mr-1" />
        statusText = 'Concluída'
    }
    return (
        <div
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white flex flex-col gap-2"
            onClick={onClick}
        >
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg truncate" title={task.title}>
                    {task.title}
                </h3>
                <span
                    className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${statusColor}`}
                >
                    {statusIcon}
                    {statusText}
                </span>
            </div>
            <p className="text-gray-600 line-clamp-2 text-sm">
                {task.description}
            </p>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                    {task.group ? `Grupo: ${task.group.name}` : 'Pessoal'}
                </span>
                <span className="text-xs text-gray-400">
                    {new Date(task.updatedAt).toLocaleString()}
                </span>
            </div>
        </div>
    )
}
