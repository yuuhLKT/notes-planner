import type { Note, NoteRequest } from '../types';

const API_URL = 'http://localhost:3000';

export const noteService = {
    async getUserNotes(userId: string): Promise<Note[]> {
        const response = await fetch(`${API_URL}/notes/user/${userId}`);
        if (!response.ok) throw new Error('Erro ao buscar notas do usuário');
        return response.json();
    },
    async getNote(id: string): Promise<Note> {
        const response = await fetch(`${API_URL}/notes/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar nota');
        return response.json();
    },
    async createNote(data: NoteRequest): Promise<Note> {
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erro ao criar nota');
        return response.json();
    },
    async updateNote(id: string, data: Partial<NoteRequest>): Promise<Note> {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erro ao atualizar nota');
        return response.json();
    },
    async deleteNote(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar nota');
    },
}; 