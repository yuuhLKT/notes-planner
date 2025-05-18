import { useEffect, useState } from 'react'
import {
    FaCog,
    FaHome,
    FaInfoCircle,
    FaSignOutAlt,
    FaStickyNote,
    FaTasks,
    FaUser,
    FaUsers,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'

const Header = () => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const savedLogin = localStorage.getItem('isLoggedIn')
        return savedLogin === 'true'
    })
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [userImage, setUserImage] = useState('/images/padrao.png')

    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn.toString())
    }, [isLoggedIn])

    useEffect(() => {
        const fetchUserImage = async () => {
            if (isLoggedIn) {
                try {
                    const userId = localStorage.getItem('userId')
                    if (userId) {
                        const image = await userService.getUserImage(userId)
                        setUserImage(image + '?t=' + Date.now())
                    }
                } catch (error) {
                    console.error('Error fetching user image:', error)
                }
            }
        }

        fetchUserImage()

        const handleProfileImageUpdate = () => {
            fetchUserImage()
        }
        window.addEventListener(
            'profile-image-updated',
            handleProfileImageUpdate
        )
        return () => {
            window.removeEventListener(
                'profile-image-updated',
                handleProfileImageUpdate
            )
        }
    }, [isLoggedIn])

    const handleLogout = () => {
        setIsLoggedIn(false)
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userId')
        setShowProfileMenu(false)
        navigate('/')
    }

    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <h1 className="text-2xl font-bold">
                        <span
                            onClick={() => navigate(isLoggedIn ? '/home' : '/')}
                            className="cursor-pointer"
                        >
                            Notes Planner
                        </span>
                    </h1>
                    <div className="bg-gray-600 w-0.5 h-8"></div>
                    <nav>
                        <ul className="flex space-x-6">
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <span
                                            onClick={() => navigate('/home')}
                                            className="hover:text-gray-300 transition-colors flex items-center gap-2 cursor-pointer"
                                        >
                                            <FaHome className="text-lg" />
                                            <span>Home</span>
                                        </span>
                                    </li>
                                    <li>
                                        <span
                                            onClick={() => navigate('/tasks')}
                                            className="hover:text-gray-300 transition-colors flex items-center gap-2 cursor-pointer"
                                        >
                                            <FaTasks className="text-lg" />
                                            <span>Tarefas</span>
                                        </span>
                                    </li>
                                    <li>
                                        <span
                                            onClick={() => navigate('/notes')}
                                            className="hover:text-gray-300 transition-colors flex items-center gap-2 cursor-pointer"
                                        >
                                            <FaStickyNote className="text-lg" />
                                            <span>Notas</span>
                                        </span>
                                    </li>
                                    <li>
                                        <span
                                            onClick={() => navigate('/groups')}
                                            className="hover:text-gray-300 transition-colors flex items-center gap-2 cursor-pointer"
                                        >
                                            <FaUsers className="text-lg" />
                                            <span>Grupos</span>
                                        </span>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <span
                                        onClick={() => {
                                            navigate('/')
                                            setTimeout(() => {
                                                const aboutSection =
                                                    document.getElementById(
                                                        'about'
                                                    )
                                                aboutSection?.scrollIntoView({
                                                    behavior: 'smooth',
                                                })
                                            }, 100)
                                        }}
                                        className="hover:text-gray-300 transition-colors flex items-center gap-2 cursor-pointer"
                                    >
                                        <FaInfoCircle className="text-lg" />
                                        <span>Sobre</span>
                                    </span>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>

                <div className="flex items-center">
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowProfileMenu(!showProfileMenu)
                                }
                                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center hover:bg-gray-500 transition-colors"
                            >
                                <img
                                    src={userImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <span
                                        onClick={() => navigate('/profile')}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <FaUser className="text-gray-600" />
                                        <span>Perfil</span>
                                    </span>
                                    <span
                                        onClick={() => navigate('/settings')}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <FaCog className="text-gray-600" />
                                        <span>Configurações</span>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <FaSignOutAlt className="text-gray-600" />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <FaUser className="text-lg" />
                            <span>Login</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
