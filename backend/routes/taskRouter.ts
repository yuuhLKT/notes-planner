import express, { Request, Response } from "express";
import Group from '../models/Group';
import Task from "../models/Task";

const router = express.Router();

// Criar uma nova task (pessoal ou de grupo)
router.post("/", async (req: Request, res: Response) => {
    try {
        const { title, description, status, user, group } = req.body;
        const task = new Task({
            title,
            description,
            status,
            user: group ? undefined : user,
            group: group || undefined,
        });
        await task.save();
        // Se for task de grupo, pode adicionar ao array tasks do grupo (opcional)
        // await Group.findByIdAndUpdate(group, { $addToSet: { tasks: task._id } });
        const populated = await Task.findById(task._id)
            .populate("user", "_id name image")
            .populate("group", "_id name");
        res.status(201).json(populated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Buscar todas as tasks de um usuário (pessoais e de grupo)
router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        // Tasks pessoais
        const personalTasks = await Task.find({ user: userId })
            .populate("user", "_id name image")
            .populate("group", "_id name");
        // Grupos do usuário
        const userGroups = await Group.find({ users: userId });
        const groupIds = userGroups.map(g => g._id);
        // Tasks de grupo
        const groupTasks = await Task.find({ group: { $in: groupIds } })
            .populate("user", "_id name image")
            .populate("group", "_id name");
        const allTasks = [...personalTasks, ...groupTasks];
        res.json(allTasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar todas as tasks de um grupo (apenas para membros)
router.get("/group/:groupId", async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string;
        const group = await Group.findById(req.params.groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        if (!group.users || !group.users.map(String).includes(String(userId))) {
            return res.status(403).json({ message: "Você não tem acesso a essas tarefas." });
        }
        const tasks = await Task.find({ group: req.params.groupId })
            .populate("user", "_id name image")
            .populate("group", "_id name");
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar uma task específica
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("user", "_id name image")
            .populate("group", "_id name");
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Editar uma task
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { title, description, status, group } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.updatedAt = new Date();
        if (group !== undefined) task.group = group;
        await task.save();
        const populated = await Task.findById(task._id)
            .populate("user", "_id name image")
            .populate("group", "_id name");
        res.json(populated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Deletar uma task
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 