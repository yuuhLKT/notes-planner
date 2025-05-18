import type { CreateGroupRequest, Group, JoinGroupRequest } from '../types';

const API_URL = 'http://localhost:3000';

export const groupService = {
    async createGroup(data: CreateGroupRequest): Promise<Group> {
        const response = await fetch(`${API_URL}/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create group');
        }

        return response.json();
    },

    async getGroups(): Promise<Group[]> {
        const response = await fetch(`${API_URL}/groups`);

        if (!response.ok) {
            throw new Error('Failed to fetch groups');
        }

        return response.json();
    },

    async getGroup(id: string): Promise<Group> {
        const response = await fetch(`${API_URL}/groups/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch group');
        }

        return response.json();
    },

    async joinGroup(data: JoinGroupRequest): Promise<Group> {
        const response = await fetch(`${API_URL}/groups/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to join group');
        }

        return response.json();
    },

    async updateGroup(id: string, data: { name: string; description: string }): Promise<Group> {
        const response = await fetch(`${API_URL}/groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update group');
        }

        return response.json();
    },

    async deleteGroup(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/groups/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete group');
        }
    },

    async removeMember(groupId: string, userId: string): Promise<void> {
        const response = await fetch(`${API_URL}/groups/${groupId}/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to remove member');
        }
    },

    async uploadGroupImage(groupId: string, imageFile: File): Promise<Group> {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await fetch(`${API_URL}/groups/${groupId}/image`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Failed to upload group image');
        }
        return response.json();
    },
}; 