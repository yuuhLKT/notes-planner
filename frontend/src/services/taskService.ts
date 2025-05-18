import type { Task, TaskRequest } from '../types';

const API_URL = 'http://localhost:3000';

export const taskService = {
    async getUserTasks(userId: string): Promise<Task[]> {
        const response = await fetch(`${API_URL}/tasks/user/${userId}`);
        if (!response.ok) throw new Error('Erro ao buscar tarefas do usuário');
        return response.json();
    },
    async getTask(id: string): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar tarefa');
        return response.json();
    },
    async createTask(data: TaskRequest): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erro ao criar tarefa');
        return response.json();
    },
    async updateTask(id: string, data: Partial<TaskRequest>): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erro ao atualizar tarefa');
        return response.json();
    },
    async deleteTask(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar tarefa');
    },
}; 