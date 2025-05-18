import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { userService } from '../services/userService'
import type { UserRequest } from '../types'

const Register = () => {
    const navigate = useNavigate()
    const register = async (e: React.FormEvent) => {
        e.preventDefault()
        const name = document.getElementById('name') as HTMLInputElement
        const email = document.getElementById('email') as HTMLInputElement
        const password = document.getElementById('password') as HTMLInputElement

        const user: UserRequest = {
            name: name.value,
            email: email.value,
            password: password.value,
        }

        try {
            await userService.createUser(user)
            alert(`Usuário ${user.name} criado com sucesso!`)
            navigate('/login')
        } catch (error) {
            console.log(error)
            alert('Erro ao criar usuário. Tente novamente.')
        }
    }

    return (
        <>
            <Header />
            <div className="flex justify-center items-center h-screen">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Registro
                    </h2>
                    <form onSubmit={register} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2">
                                Nome
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Digite seu nome"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
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
                            type="submit"
                            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            Registrar
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        Já tem uma conta?{' '}
                        <a
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                            Faça login
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Register
