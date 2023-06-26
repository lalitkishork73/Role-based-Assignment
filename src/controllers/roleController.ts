import { Response, Request, NextFunction } from 'express';
import roleModel from '../models/roleModel';

async function CreateRoles(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const createRoles = await roleModel.create(data);
        if (!createRoles) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: 'name',
                        message: 'Name should be at least 2 characters.',
                        code: 'INVALID_INPUT'
                    }
                ]
            });
        }
        return res.status(201).json({ status: 'true', content: { data: createRoles } });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function GetAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
        const page: any = req.query.p || 1;
        const allRoles = await roleModel
            .find()
            .sort({ name: 1 })
            .skip((page - 1) * 10)
            .limit(10);
        if (allRoles.length === 0) {
            return res.status(404).json({ status: 'false' });
        }
        const meta = {
            total: allRoles.length,
            pages: Math.ceil(allRoles.length / 10),
            page: page
        };
        return res.status(200).json({ status: 'true', content: { meta: meta }, data: allRoles });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export default { CreateRoles, GetAllRoles };
