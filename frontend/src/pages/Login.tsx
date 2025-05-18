import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { userService } from '../services/userService'
import type { LoginRequest } from '../types'

const Login = () => {
    const navigate = useNavigate()
    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        const email = document.getElementById('email') as HTMLInputElement
        const password = document.getElementById('password') as HTMLInputElement

        const user: LoginRequest = {
            email: email.value,
            password: password.value,
        }

        try {
            const response = await userService.loginUser(user)
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('userId', response._id)
            alert('Login realizado com sucesso!')
            navigate('/home')
        } catch (error) {
            alert('Erro ao fazer login. Tente novamente.')
            console.log(error)
        }
    }

    return (
        <>
            <Header />
            <div className="flex justify-center items-center h-screen">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Login
                    </h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-2 border rounded-md"
                                placeholder="Digite seu email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-2 border rounded-md"
                                placeholder="Digite sua senha"
                            />
                        </div>
                        <button
                            onClick={login}
                            type="submit"
                            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            Entrar
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        Não tem uma conta?{' '}
                        <a
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                            Registre-se
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login
