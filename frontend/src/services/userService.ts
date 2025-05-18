import type { LoginRequest, UserRequest } from "../types";

const API_URL = "http://localhost:3000";

export const userService = {
    async getUsers() {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    },

    async getUser(id: string) {
        const response = await fetch(`${API_URL}/users/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return response.json();
    },

    async createUser(user: UserRequest) {
        const response = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Failed to create user');
        }
        return response.json();
    },

    async updateUser(id: string, user: UserRequest) {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        return response.json();
    },

    async loginUser(user: LoginRequest) {
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Failed to login');
        }
        return response.json();
    },

    async getUserImage(id: string) {
        const response = await fetch(`${API_URL}/users/${id}/image`);
        if (!response.ok) {
            throw new Error('Failed to fetch user image');
        }
        return response.json();
    },

    async uploadUserImage(id: string, imageFile: File) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${API_URL}/users/${id}/image`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Failed to upload user image');
        }
        return response.json();
    }
}; 