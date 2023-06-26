import { Response, Request, NextFunction } from 'express';
import communityModel from '../models/communityModel';
import userModel from '../models/userModel';
import memberModel from '../models/memberModel';


async function CreateCommunity(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        data['slug'] = data.name;
        data['owner'] = req.uid;

        console.log(data);

        const CreateCommunity = await communityModel.create(data);

        if (CreateCommunity) {
            return res.status(201).json({ status: 'true', content: { data: CreateCommunity } });
        }

        return res.status(400).json({ status: false });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function GetAllCommunity(req: Request, res: Response, next: NextFunction) {
    try {
        const page: any = req.query.p || 1;

        const allCommunity = await communityModel
            .find(
                {},
                {
                    strictPopulate: false
                }
            )
            .populate('owner', ['_id', 'name'])
            .sort({ name: 1 })
            .skip((page - 1) * 10)
            .limit(10);
        if (allCommunity.length === 0) {
            return res.status(404).json({ status: 'false' });
        }
        const meta = {
            total: allCommunity.length,
            pages: Math.ceil(allCommunity.length / 10),
            page: page
        };

        return res.status(200).json({ status: 'true', content: { meta: meta }, data: allCommunity });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function GetAllMembers(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        console.log(id);
        const page: any = req.query.p || 1;
        const allMember = await memberModel
            .find({ community: id })
            .populate('user', ['_id', 'name'])
            .populate('role', ['_id', 'name'])
            .sort({ name: 1 })
            .skip((page - 1) * 10)
            .limit(10)
            .select({ updatedAt: 0, __v: 0 });
        console.log(allMember);

        if (allMember.length === 0) {
            return res.status(404).json({ status: 'false' });
        }

        const meta = {
            total: allMember.length,
            pages: Math.ceil(allMember.length / 10),
            page: page
        };
        return res.status(200).json({ status: 'true', content: { meta: meta }, data: allMember });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function GetMyOwnedCommunity(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.uid;
        const page: any = req.query.p || 1;
        const allMember = await communityModel
            .find({ owner: id })
            .sort({ name: 1 })
            .skip((page - 1) * 10)
            .limit(10)
            .select({ __v: 0 });
        if (allMember.length === 0) {
            return res.status(404).json({ status: 'false' });
        }
        const meta = {
            total: allMember.length,
            pages: Math.ceil(allMember.length / 10),
            page: page
        };
        return res.status(200).json({ status: 'true', content: { meta: meta }, data: allMember });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function GetMyJoinedCommunity(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.uid;
        const page: any = req.query.p || 1;
        const allMember = await memberModel
            .find({ user: id })
            .populate({ path: 'community', populate: [{ path: 'owner', select: '_id name' }], select: { __v: 0 } })
            .sort({ name: 1 })
            .skip((page - 1) * 10)
            .limit(10)
            .select({ community: 1, _id: 0 });
        if (allMember.length === 0) {
            return res.status(404).json({ status: 'false' });
        }

        const result = allMember.map((member) => member.community);

        const meta = {
            total: allMember.length,
            pages: Math.ceil(allMember.length / 10),
            page: page
        };
        return res.status(200).json({ status: 'true', content: { meta: meta }, data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export default { CreateCommunity, GetAllCommunity, GetAllMembers, GetMyOwnedCommunity, GetMyJoinedCommunity };
