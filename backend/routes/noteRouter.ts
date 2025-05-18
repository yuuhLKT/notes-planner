import express, { Request, Response } from "express";
import Group from '../models/Group';
import Note from "../models/Notes";
import { NoteRequest, NoteResponse } from "../types";

const router = express.Router();

// Criar uma nova nota (pessoal ou de grupo)
router.post("/", async (req: Request<{}, {}, NoteRequest>, res: Response<NoteResponse>) => {
    try {
        const { title, content, user, group } = req.body;
        const note = new Note({
            title,
            content,
            user: group ? undefined : user,
            group: group || undefined,
        });
        await note.save();
        // Se for nota de grupo, adiciona ao array notes do grupo
        if (group) {
            await Group.findByIdAndUpdate(group, { $addToSet: { notes: note._id } });
        }
        const populated = await Note.findById(note._id)
            .populate("user", "id name image")
            .populate("group", "id name");
        res.status(201).json(populated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Buscar todas as notas de um usuário (pessoais e de grupo)
router.get("/user/:userId", async (req: Request, res: Response<NoteResponse[]>) => {
    try {
        const userId = req.params.userId;

        // Busca todas as notas pessoais do usuário
        const personalNotes = await Note.find({ user: userId })
            .populate("user", "id name image")
            .populate("group", "id name");

        // Busca todos os grupos que o usuário ainda é membro
        const userGroups = await Group.find({ users: userId });
        const groupIds = userGroups.map(g => g._id);

        // Busca notas de grupo onde o grupo está na lista de grupos do usuário (ainda é membro)
        const groupNotes = await Note.find({
            group: { $in: groupIds }
        })
            .populate("user", "id name image")
            .populate("group", "id name");

        // Combina as notas pessoais com as notas de grupo
        const allNotes = [...personalNotes, ...groupNotes];
        res.json(allNotes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar todas as notas de um grupo
router.get("/group/:groupId", async (req: Request, res: Response<NoteResponse[]>) => {
    try {
        const userId = req.query.userId as string;
        const group = await Group.findById(req.params.groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        if (!group.users || !group.users.map(String).includes(String(userId))) {
            return res.status(403).json({ message: "Você não tem acesso a essas notas." });
        }
        const notes = await Note.find({ group: req.params.groupId })
            .populate("user", "id name image")
            .populate("group", "id name");
        res.json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar uma nota específica
router.get("/:id", async (req: Request, res: Response<NoteResponse>) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate("user", "id name image")
            .populate("group", "id name");
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json(note);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Editar uma nota
router.put("/:id", async (req: Request<{ id: string }, {}, NoteRequest>, res: Response<NoteResponse>) => {
    try {
        const { title, content, group } = req.body;
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        note.title = title || note.title;
        note.content = content || note.content;
        note.updatedAt = new Date();
        if (group !== undefined) note.group = group;
        await note.save();
        const populated = await Note.findById(note._id)
            .populate("user", "id name image")
            .populate("group", "id name");
        res.json(populated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Deletar uma nota
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        await note.deleteOne();
        res.json({ message: "Note deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 