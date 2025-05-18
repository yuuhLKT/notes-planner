import { useEffect, useState } from 'react'
import Header from '../components/Header'
import NoteCard from '../components/NoteCard'
import NoteViewModal from '../components/NoteViewModal'
import { groupService } from '../services/groupService'
import { noteService } from '../services/noteService'
import type { Group, Note } from '../types'

export default function Notes() {
    const [personalNotes, setPersonalNotes] = useState<Note[]>([])
    const [groupNotes, setGroupNotes] = useState<Note[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState({
        title: '',
        content: '',
        group: '',
    })
    const [viewingNote, setViewingNote] = useState<Note | null>(null)

    const userId = localStorage.getItem('userId') || ''

    useEffect(() => {
        loadNotes()
        loadGroups()
    }, [])

    const loadNotes = async () => {
        if (!userId) return
        const notes = await noteService.getUserNotes(userId)
        setPersonalNotes(notes.filter((note) => !note.group))
        setGroupNotes(notes.filter((note) => note.group))
    }

    const loadGroups = async () => {
        const data = await groupService.getGroups()
        setGroups(data.filter((g) => g.users?.some((u) => u._id === userId)))
    }

    const handleOpenModal = (note?: Note) => {
        if (note) {
            setSelectedNote(note)
            setForm({
                title: note.title,
                content: note.content,
                group: note.group?._id || '',
            })
            setIsEditing(true)
        } else {
            setSelectedNote(null)
            setForm({ title: '', content: '', group: '' })
            setIsEditing(false)
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedNote(null)
        setForm({ title: '', content: '', group: '' })
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
            if (isEditing && selectedNote) {
                await noteService.updateNote(selectedNote._id, {
                    title: form.title,
                    content: form.content,
                    group: form.group || undefined,
                })
            } else {
                await noteService.createNote({
                    title: form.title,
                    content: form.content,
                    ...(form.group ? {} : { user: userId }),
                    group: form.group || undefined,
                })
            }
            handleCloseModal()
            loadNotes()
        } catch {
            alert('Erro ao salvar nota.')
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Deseja realmente deletar esta nota?')) return
        try {
            await noteService.deleteNote(id)
            handleCloseModal()
            loadNotes()
        } catch {
            alert('Erro ao deletar nota.')
        }
    }

    const handleOpenViewModal = (note: Note) => {
        setViewingNote(note)
    }

    const handleCloseViewModal = () => {
        setViewingNote(null)
    }

    const handleEditFromView = () => {
        if (viewingNote) {
            setSelectedNote(viewingNote)
            setForm({
                title: viewingNote.title,
                content: viewingNote.content,
                group: viewingNote.group?._id || '',
            })
            setIsEditing(true)
            setShowModal(true)
            setViewingNote(null)
        }
    }

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Minhas Notas</h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Nova Nota
                    </button>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                        Notas Pessoais
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {personalNotes.map((note) => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onClick={() => handleOpenViewModal(note)}
                            />
                        ))}
                        {personalNotes.length === 0 && (
                            <p className="text-gray-500">
                                Nenhuma nota pessoal.
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        Notas de Grupos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupNotes.map((note) => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onClick={() => handleOpenViewModal(note)}
                            />
                        ))}
                        {groupNotes.length === 0 && (
                            <p className="text-gray-500">
                                Nenhuma nota de grupo.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal de criar/editar/visualizar nota */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Editar Nota' : 'Nova Nota'}
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
                                    Conteúdo
                                </label>
                                <textarea
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded min-h-[120px]"
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
                                    <option value="">Nota pessoal</option>
                                    {groups.map((g) => (
                                        <option key={g._id} value={g._id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                {isEditing && selectedNote && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(selectedNote._id)
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
            {viewingNote && (
                <NoteViewModal
                    note={viewingNote}
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
