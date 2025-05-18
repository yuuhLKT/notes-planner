import { FaStickyNote, FaUsers } from 'react-icons/fa'
import type { Note } from '../types'

interface NoteCardProps {
    note: Note
    onClick?: () => void
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
    return (
        <div
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white flex flex-col gap-2"
            onClick={onClick}
        >
            <div className="flex items-center gap-2 mb-1">
                <FaStickyNote className="text-blue-400" />
                <h3 className="font-bold text-lg truncate" title={note.title}>
                    {note.title}
                </h3>
            </div>
            <p className="text-gray-600 line-clamp-2 text-sm">{note.content}</p>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    {note.group ? (
                        <>
                            <FaUsers className="inline text-gray-400" /> Grupo:{' '}
                            {note.group.name}
                        </>
                    ) : (
                        'Pessoal'
                    )}
                </span>
                <span className="text-xs text-gray-400">
                    {new Date(note.updatedAt).toLocaleString()}
                </span>
            </div>
        </div>
    )
}
