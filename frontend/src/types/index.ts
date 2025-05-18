export type User = {
    _id: string;
    name: string;
    email: string;
    groups: Pick<Group, "_id" | "name">[];
    image: string;
};

export type Group = {
    _id: string;
    name: string;
    description: string;
    code: string;
    image: string;
    leader: {
        _id: string;
        name: string;
        email: string;
        image: string;
    };
    users?: {
        _id: string;
        name: string;
        email: string;
        image: string;
    }[];
};

export type UserResponse = {
    _id: string;
    name: string;
    email: string;
    groups: Pick<Group, "_id" | "name">[];
    image: string;
};

export type UserRequest = {
    name: string;
    email: string;
    password: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type GroupRequest = {
    name: string;
    description: string;
    leader: User["_id"];
};

export type GroupResponse = {
    _id: string;
    name: string;
    description: string;
    users?: User[];
    leader: User;
    image: string;
};

export type CreateGroupRequest = {
    name: string;
    description: string;
    leader: string;
};

export type JoinGroupRequest = {
    code: string;
    userId: string;
};

export type Note = {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        _id: string;
        name: string;
        image: string;
    };
    group?: {
        _id: string;
        name: string;
    };
};

export type NoteRequest = {
    title: string;
    content: string;
    user?: string;
    group?: string;
};

export type Task = {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
    updatedAt: string;
    user?: {
        _id: string;
        name: string;
        image: string;
    };
    group?: {
        _id: string;
        name: string;
    };
};

export type TaskRequest = {
    title: string;
    description: string;
    status?: 'pending' | 'in_progress' | 'completed';
    user?: string;
    group?: string;
};

export type TaskResponse = Task;
