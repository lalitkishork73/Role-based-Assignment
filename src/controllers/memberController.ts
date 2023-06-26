import { Response, Request, NextFunction } from 'express';
import memberModel from '../models/memberModel';

async function AddMember(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;
        const createMember = await memberModel.create(data);

        if (createMember) {
            return res.status(201).json({ status: 'true', content: { data: createMember } });
        }
        return res.status(400).json({ status: 'false' });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function RemoveMember(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const removeMember = await memberModel.deleteOne({ _id: id });

        if (!removeMember) {
            return res.status(404).json({ status: 'false' });
        }
        return res.status(200).json({ status: 'true' });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export default { AddMember, RemoveMember };
