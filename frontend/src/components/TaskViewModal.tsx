import {
    FaCheckCircle,
    FaHourglassHalf,
    FaSpinner,
    FaUser,
    FaUsers,
} from 'react-icons/fa'
import type { Task } from '../types'

interface TaskViewModalProps {
    task: Task
    onClose: () => void
    editButton?: React.ReactNode
}

export default function TaskViewModal({
    task,
    onClose,
    editButton,
}: TaskViewModalProps) {
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    ×
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-blue-500 text-2xl">
                        {task.group ? <FaUsers /> : <FaUser />}
                    </span>
                    <h2
                        className="text-2xl font-bold truncate"
                        title={task.title}
                    >
                        {task.title}
                    </h2>
                </div>
                <div className="mb-4 flex items-center gap-2">
                    <span
                        className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${statusColor}`}
                    >
                        {statusIcon}
                        {statusText}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        {task.group ? (
                            <>
                                <FaUsers className="inline text-gray-400" />{' '}
                                Grupo: {task.group.name}
                            </>
                        ) : (
                            'Pessoal'
                        )}
                    </span>
                </div>
                <div className="mb-6">
                    <p className="text-gray-700 whitespace-pre-line break-words text-base">
                        {task.description}
                    </p>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>
                        Atualizada em{' '}
                        {new Date(task.updatedAt).toLocaleString()}
                    </span>
                    {task.user && (
                        <span className="flex items-center gap-1">
                            <img
                                src={task.user.image}
                                alt={task.user.name}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                            {task.user.name}
                        </span>
                    )}
                </div>
                {editButton && (
                    <div className="flex justify-end mt-6">{editButton}</div>
                )}
            </div>
        </div>
    )
}
