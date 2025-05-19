export type User = {
    id: string;
    name: string;
    email: string;
    groups: Pick<Group, "id" | "name">[];
    image: string;
};

export type Group = {
    id: string;
    name: string;
    description: string;
    users?: User[];
    leader: User;
    image: string;
    code: string;
};

export type UserResponse = {
    id: string;
    name: string;
    email: string;
    groups: Pick<Group, "id" | "name">[];
    image: string;
};

export type UserRequest = {
    name: string;
    email: string;
    password?: string;
};

export type GroupRequest = {
    name: string;
    description: string;
    leader: User["id"];
};

export type GroupResponse = {
    id: string;
    name: string;
    description: string;
    users?: Pick<User, "id" | "name" | "image">[];
    leader: Pick<User, "id" | "name" | "image">;
    image: string;
    code: string;
};

export type JoinGroupRequest = {
    code: string;
    userId: string;
};

export type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: Pick<User, 'id' | 'name' | 'image'>;
    group?: Pick<Group, 'id' | 'name'>;
};

export type NoteRequest = {
    title: string;
    content: string;
    user: string;
    group?: string;
};

export type NoteResponse = Note;

export type Task = {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
    updatedAt: string;
    user?: Pick<User, 'id' | 'name' | 'image'>;
    group?: Pick<Group, 'id' | 'name'>;
};

export type TaskRequest = {
    title: string;
    description: string;
    status?: 'pending' | 'in_progress' | 'completed';
    user?: string;
    group?: string;
};

export type TaskResponse = Task;
