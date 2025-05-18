/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { FaCrown } from 'react-icons/fa'
import Header from '../components/Header'
import { groupService } from '../services/groupService'
import type { Group } from '../types'

export default function Groups() {
    const [groups, setGroups] = useState<Group[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showJoinModal, setShowJoinModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedGroup, setEditedGroup] = useState({
        name: '',
        description: '',
    })
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
    })
    const [joinCode, setJoinCode] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadGroups()
    }, [])

    const loadGroups = async () => {
        try {
            const data = await groupService.getGroups()
            setGroups(data)
        } catch (error) {
            console.error('Error loading groups:', error)
        }
    }

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userId = localStorage.getItem('userId')
            if (!userId) {
                alert('Você precisa estar logado para criar um grupo')
                return
            }
            await groupService.createGroup({
                ...newGroup,
                leader: userId,
            })
            setShowCreateModal(false)
            setNewGroup({ name: '', description: '' })
            loadGroups()
        } catch (error) {
            console.error('Error creating group:', error)
            alert('Erro ao criar grupo. Tente novamente.')
        }
    }

    const handleJoinGroup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userId = localStorage.getItem('userId')
            if (!userId) {
                alert('Você precisa estar logado para entrar em um grupo')
                return
            }
            await groupService.joinGroup({
                code: joinCode,
                userId,
            })
            setShowJoinModal(false)
            setJoinCode('')
            loadGroups()
            alert('Você entrou no grupo com sucesso!')
        } catch (error) {
            console.error('Error joining group:', error)
            alert(
                'Erro ao entrar no grupo. Verifique se o código está correto.'
            )
        }
    }

    const handleGroupClick = (group: Group) => {
        setSelectedGroup(group)
        setEditedGroup({
            name: group.name,
            description: group.description,
        })
        setShowDetailsModal(true)
    }

    const handleEditGroup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedGroup) return

        try {
            await groupService.updateGroup(selectedGroup._id, editedGroup)
            setShowDetailsModal(false)
            setIsEditing(false)
            loadGroups()
            alert('Grupo atualizado com sucesso!')
        } catch (error) {
            console.error('Error updating group:', error)
            alert('Erro ao atualizar grupo. Tente novamente.')
        }
    }

    const handleDeleteGroup = async () => {
        if (!selectedGroup) return

        if (!confirm('Tem certeza que deseja excluir este grupo?')) return

        try {
            await groupService.deleteGroup(selectedGroup._id)
            setShowDetailsModal(false)
            loadGroups()
            alert('Grupo excluído com sucesso!')
        } catch (error) {
            console.error('Error deleting group:', error)
            alert('Erro ao excluir grupo. Tente novamente.')
        }
    }

    const handleRemoveMember = async (userId: string) => {
        if (!selectedGroup) return
        if (!confirm('Tem certeza que deseja remover este membro do grupo?'))
            return
        try {
            await groupService.removeMember(selectedGroup._id, userId)
            // Atualiza o grupo selecionado após remoção
            const updatedGroup = await groupService.getGroup(selectedGroup._id)
            setSelectedGroup(updatedGroup)
            loadGroups()
            alert('Membro removido com sucesso!')
        } catch (error) {
            alert('Erro ao remover membro. Tente novamente.')
        }
    }

    const handleLeaveGroup = async () => {
        if (!selectedGroup) return
        const userId = localStorage.getItem('userId')
        if (!userId) return
        if (!confirm('Tem certeza que deseja sair deste grupo?')) return
        try {
            await groupService.removeMember(selectedGroup._id, userId)
            setShowDetailsModal(false)
            loadGroups()
            alert('Você saiu do grupo!')
        } catch (error) {
            alert('Erro ao sair do grupo. Tente novamente.')
        }
    }

    const isGroupLeader = (group: Group) => {
        const userId = localStorage.getItem('userId')
        return userId && String(userId) === String(group.leader._id)
    }

    const handleGroupImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!selectedGroup) return
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const updatedGroup = await groupService.uploadGroupImage(
                selectedGroup._id,
                file
            )
            setSelectedGroup(updatedGroup)
            loadGroups()
            alert('Imagem do grupo atualizada com sucesso!')
        } catch {
            alert('Erro ao atualizar imagem do grupo.')
        }
    }

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Grupos</h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Criar Grupo
                        </button>
                        <button
                            onClick={() => setShowJoinModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Entrar em Grupo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => (
                        <div
                            key={group._id}
                            onClick={() => handleGroupClick(group)}
                            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <img
                                src={group.image}
                                alt={group.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h2 className="text-xl font-semibold mb-2">
                                {group.name}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {group.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {group.users?.length || 0} membros
                                </span>
                                {isGroupLeader(group) && (
                                    <>
                                        <span className="text-sm text-blue-500 flex items-center gap-1">
                                            <FaCrown className="text-yellow-500" />{' '}
                                            Você é o líder
                                        </span>
                                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded ml-2">
                                            Código: {group.code}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal de Criar Grupo */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                            <h2 className="text-xl font-bold mb-4">
                                Criar Novo Grupo
                            </h2>
                            <form onSubmit={handleCreateGroup}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={newGroup.name}
                                        onChange={(e) =>
                                            setNewGroup({
                                                ...newGroup,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={newGroup.description}
                                        onChange={(e) =>
                                            setNewGroup({
                                                ...newGroup,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCreateModal(false)
                                        }
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Criar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Entrar em Grupo */}
                {showJoinModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                            <h2 className="text-xl font-bold mb-4">
                                Entrar em Grupo
                            </h2>
                            <form onSubmit={handleJoinGroup}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Código do Grupo
                                    </label>
                                    <input
                                        type="text"
                                        value={joinCode}
                                        onChange={(e) =>
                                            setJoinCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                        maxLength={5}
                                        placeholder="Digite o código de 5 dígitos"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowJoinModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Entrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Detalhes do Grupo */}
                {showDetailsModal && selectedGroup && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    {isEditing
                                        ? 'Editar Grupo'
                                        : 'Detalhes do Grupo'}
                                </h2>
                                <div className="space-x-2">
                                    {isGroupLeader(selectedGroup) &&
                                        !isEditing && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setIsEditing(true)
                                                    }
                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={handleDeleteGroup}
                                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Excluir
                                                </button>
                                            </>
                                        )}
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false)
                                            setIsEditing(false)
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>

                            {/* Imagem do grupo e botão de upload para o líder */}
                            <div className="flex flex-col items-center mb-4">
                                <img
                                    src={selectedGroup.image}
                                    alt={selectedGroup.name}
                                    className="w-32 h-32 object-cover rounded-full border mb-2"
                                />
                                {isGroupLeader(selectedGroup) && !isEditing && (
                                    <>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleGroupImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                        >
                                            Alterar imagem do grupo
                                        </button>
                                    </>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleEditGroup}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2">
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            value={editedGroup.name}
                                            onChange={(e) =>
                                                setEditedGroup({
                                                    ...editedGroup,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2">
                                            Descrição
                                        </label>
                                        <textarea
                                            value={editedGroup.description}
                                            onChange={(e) =>
                                                setEditedGroup({
                                                    ...editedGroup,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
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
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-700">
                                            Nome
                                        </h3>
                                        <p>{selectedGroup.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700">
                                            Descrição
                                        </h3>
                                        <p>{selectedGroup.description}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700">
                                            Líder
                                        </h3>
                                        <p>{selectedGroup.leader.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700">
                                            Membros (
                                            {selectedGroup.users?.length || 0})
                                        </h3>
                                        <ul className="mt-2 space-y-2">
                                            {selectedGroup.users?.map(
                                                (user) => (
                                                    <li
                                                        key={user._id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <img
                                                            src={user.image}
                                                            alt={user.name}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <span className="flex items-center gap-1">
                                                            {user.name}
                                                            {user._id ===
                                                                selectedGroup
                                                                    .leader
                                                                    ._id && (
                                                                <FaCrown
                                                                    className="text-yellow-500 ml-1"
                                                                    title="Líder"
                                                                />
                                                            )}
                                                        </span>
                                                        {isGroupLeader(
                                                            selectedGroup
                                                        ) &&
                                                            user._id !==
                                                                selectedGroup
                                                                    .leader
                                                                    ._id && (
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation()
                                                                        handleRemoveMember(
                                                                            user._id
                                                                        )
                                                                    }}
                                                                    className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                                >
                                                                    Remover
                                                                </button>
                                                            )}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    {(() => {
                                        const userId =
                                            localStorage.getItem('userId')
                                        if (
                                            selectedGroup.users?.some(
                                                (u) => u._id === userId
                                            ) &&
                                            userId !== selectedGroup.leader._id
                                        ) {
                                            return (
                                                <button
                                                    onClick={handleLeaveGroup}
                                                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Sair do grupo
                                                </button>
                                            )
                                        }
                                        return null
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
