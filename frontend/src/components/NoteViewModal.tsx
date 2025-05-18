import { FaStickyNote, FaUsers } from 'react-icons/fa'
import type { Note } from '../types'

interface NoteViewModalProps {
    note: Note
    onClose: () => void
    editButton?: React.ReactNode
}

export default function NoteViewModal({
    note,
    onClose,
    editButton,
}: NoteViewModalProps) {
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
                    <FaStickyNote className="text-blue-500 text-2xl" />
                    <h2
                        className="text-2xl font-bold truncate"
                        title={note.title}
                    >
                        {note.title}
                    </h2>
                </div>
                <div className="mb-4">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        {note.group ? (
                            <>
                                <FaUsers className="inline text-gray-400" />{' '}
                                Grupo: {note.group.name}
                            </>
                        ) : (
                            'Pessoal'
                        )}
                    </span>
                </div>
                <div className="mb-6">
                    <p className="text-gray-700 whitespace-pre-line break-words text-base">
                        {note.content}
                    </p>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>
                        Atualizada em{' '}
                        {new Date(note.updatedAt).toLocaleString()}
                    </span>
                    {note.user && (
                        <span className="flex items-center gap-1">
                            <img
                                src={note.user.image}
                                alt={note.user.name}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                            {note.user.name}
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
