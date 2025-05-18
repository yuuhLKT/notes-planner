import { Request, Response, Router } from "express";
import multer from 'multer';
import path from 'path';
import Group from "../models/Group";
import User from "../models/User";
import { GroupRequest, GroupResponse, JoinGroupRequest } from "../types";

const groupRouter = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(process.cwd(), '../frontend/public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'grupo-' + uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Função para gerar código aleatório de 5 dígitos
const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};

groupRouter.post("/", async (req: Request<GroupRequest>, res: Response<GroupResponse>) => {
    const { name, description, leader } = req.body;

    // Gera um código único para o grupo
    let code;
    let isUnique = false;
    while (!isUnique) {
        code = generateGroupCode();
        const existingGroup = await Group.findOne({ code });
        if (!existingGroup) {
            isUnique = true;
        }
    }

    const group = await Group.create({
        name,
        description,
        leader,
        code,
        users: [leader]
    });
    await group.save();

    // Adiciona o grupo ao array groups do líder
    await User.findByIdAndUpdate(leader, { $addToSet: { groups: group._id } });

    const populatedGroup = await Group.findById(group._id)
        .populate('leader', '_id name image')
        .populate('users', '_id name image');
    res.status(201).json(populatedGroup);
});

groupRouter.get("/", async (req: Request, res: Response<GroupResponse[]>) => {
    const groups = await Group.find()
        .populate('leader', '_id name image')
        .populate('users', '_id name image');
    res.status(200).json(groups);
});

groupRouter.get("/:id", async (req: Request, res: Response<GroupResponse>) => {
    const { id } = req.params;
    const group = await Group.findById(id)
        .populate('leader', '_id name image')
        .populate('users', '_id name image');

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
});

groupRouter.put("/:id", async (req: Request, res: Response<GroupResponse>) => {
    const { id } = req.params;
    const { name, description, leader } = req.body;

    const group = await Group.findByIdAndUpdate(
        id,
        { name, description, leader },
        { new: true }
    )
        .populate('leader', '_id name image')
        .populate('users', '_id name image');

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
});

groupRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
});

// Rota para entrar em um grupo usando o código
groupRouter.post("/join", async (req: Request<JoinGroupRequest>, res: Response<GroupResponse>) => {
    const { code, userId } = req.body;

    const group = await Group.findOne({ code });
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    // Inicializa o array de usuários se não existir
    if (!group.users) {
        group.users = [];
    }

    // Verifica se o usuário já está no grupo
    if (group.users.includes(userId)) {
        return res.status(400).json({ message: "User already in group" });
    }

    // Adiciona o usuário ao grupo
    group.users.push(userId);
    await group.save();

    // Adiciona o grupo ao array groups do usuário
    await User.findByIdAndUpdate(userId, { $addToSet: { groups: group._id } });

    const populatedGroup = await Group.findById(group._id)
        .populate('leader', '_id name image')
        .populate('users', '_id name image');
    res.status(200).json(populatedGroup);
});

// Rota para remover um membro do grupo (exceto o líder)
groupRouter.delete('/:groupId/users/:userId', async (req: Request, res: Response) => {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }
    // Não permitir remover o líder
    if (String(group.leader) === String(userId)) {
        return res.status(400).json({ message: 'Não é possível remover o líder do grupo.' });
    }
    // Remove o usuário do array users
    group.users = (group.users || []).filter((id: any) => String(id) !== String(userId));
    await group.save();
    // Remove o grupo do array groups do usuário
    await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });
    const populatedGroup = await Group.findById(groupId)
        .populate('leader', '_id name image')
        .populate('users', '_id name image');
    res.status(200).json(populatedGroup);
});

// Rota para upload de imagem do grupo
// POST /groups/:id/image
// Campo: image (form-data)
groupRouter.post('/:id/image', upload.single('image'), async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }
    const imagePath = '/images/' + req.file.filename;
    const group = await Group.findByIdAndUpdate(
        id,
        { image: imagePath },
        { new: true }
    )
        .populate('leader', '_id name image')
        .populate('users', '_id name image');
    if (!group) {
        return res.status(404).json({ message: 'Grupo não encontrado.' });
    }
    res.status(200).json(group);
});

export default groupRouter;
