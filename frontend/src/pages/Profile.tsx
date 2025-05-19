import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { groupService } from '../services/groupService'
import { userService } from '../services/userService'
import type { Group, UserRequest, UserResponse } from '../types'

const Profile = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState<UserResponse | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<UserRequest>({
        name: '',
        email: '',
        password: '',
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [userGroups, setUserGroups] = useState<Group[]>([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId')
                if (!userId) {
                    navigate('/login')
                    return
                }
                const response = await userService.getUser(userId)
                const userData = Array.isArray(response)
                    ? response[0]
                    : response
                if (!userData) {
                    throw new Error('User not found')
                }
                setUser(userData)
                setFormData({
                    name: userData.name,
                    email: userData.email,
                    password: '',
                })
                if (userData.groups && userData.groups.length > 0) {
                    const groupDetails = await Promise.all(
                        userData.groups.map((groupId: string) =>
                            groupService.getGroup(groupId)
                        )
                    )
                    setUserGroups(groupDetails)
                } else {
                    setUserGroups([])
                }
            } catch (error) {
                console.error('Error fetching user:', error)
                alert('Erro ao carregar dados do usuário')
            }
        }

        fetchUser()
    }, [navigate])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            if (!user) return

            const dataToSend = {
                name: formData.name,
                email: formData.email,
                ...(formData.password && { password: formData.password }),
            }

            const updatedUser = await userService.updateUser(
                user._id,
                dataToSend
            )
            setUser(updatedUser)
            setIsEditing(false)
            alert('Perfil atualizado com sucesso!')
        } catch (error) {
            console.error('Error updating user:', error)
            alert('Erro ao atualizar perfil')
        }
    }

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
            })
        }
        setIsEditing(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        try {
            const userId = localStorage.getItem('userId')
            if (!userId) {
                throw new Error('User ID not found')
            }
            const updatedUser = await userService.uploadUserImage(userId, file)
            setUser({
                ...updatedUser,
                image: updatedUser.image + '?t=' + Date.now(),
            })
            window.dispatchEvent(new Event('profile-image-updated'))
            alert('Imagem atualizada com sucesso!')
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Erro ao atualizar imagem')
        }
    }

    if (!user) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-screen">
                    <p>Carregando...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">
                            Perfil do Usuário
                        </h1>
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Editar
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col items-center mb-6">
                            <div
                                onClick={handleImageClick}
                                className="w-32 h-32 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                <img
                                    src={user.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Clique na imagem para alterar
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nome
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="mt-1">{user.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="mt-1">{user.email}</p>
                            )}
                        </div>

                        {isEditing && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nova Senha
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Deixe em branco para manter a senha atual"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Grupos
                            </label>
                            <div className="mt-1">
                                {userGroups.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {userGroups.map((group) => (
                                            <li
                                                key={group._id}
                                                className="py-2 flex items-center gap-3"
                                            >
                                                <img
                                                    src={group.image}
                                                    alt={group.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <span className="font-medium">
                                                    {group.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {group.users?.length || 0}{' '}
                                                    membros
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Nenhum grupo encontrado</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
