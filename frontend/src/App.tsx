import { useNavigate } from 'react-router-dom'
import Header from './components/Header'

function App() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Notes Planner
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Organize suas tarefas e notas de forma simples e
                            eficiente
                        </p>
                        <button
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
                            onClick={() => navigate('/login')}
                        >
                            Começar Agora
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-3xl mb-4">
                                📝
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Notas Rápidas
                            </h3>
                            <p className="text-gray-600">
                                Crie e organize suas notas de forma intuitiva
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-3xl mb-4">
                                ✅
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Gerenciamento de Tarefas
                            </h3>
                            <p className="text-gray-600">
                                Mantenha suas tarefas organizadas e nunca perca
                                um prazo
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-3xl mb-4">
                                📱
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Acesso em Qualquer Lugar
                            </h3>
                            <p className="text-gray-600">
                                Acesse suas notas e tarefas de qualquer
                                dispositivo
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Sobre o Notes Planner
                        </h2>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <p className="text-gray-600 mb-4">
                                O Notes Planner é uma aplicação moderna e
                                intuitiva desenvolvida para ajudar você a
                                organizar suas tarefas e notas de forma
                                eficiente. Com uma interface amigável e recursos
                                poderosos, você pode gerenciar suas atividades
                                diárias, criar notas importantes e manter tudo
                                organizado em um só lugar.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Uma das principais características do Notes
                                Planner é a capacidade de colaboração em tempo
                                real. Múltiplos usuários podem trabalhar juntos,
                                compartilhar notas e tarefas, e manter todos os
                                membros da equipe atualizados sobre o progresso
                                dos projetos. Isso torna a ferramenta perfeita
                                tanto para uso pessoal quanto para equipes de
                                trabalho.
                            </p>
                            <p className="text-gray-600">
                                Com recursos como categorização de notas,
                                lembretes personalizados, e sincronização em
                                tempo real, o Notes Planner se adapta às suas
                                necessidades, ajudando você a ser mais produtivo
                                e organizado em seu dia a dia.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default App
