import * as jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { Response, Request, NextFunction } from 'express';
import communityModel from '../../models/communityModel';

declare global {
    namespace Express {
        interface Request {
            uid: string;
        }
    }
}

const authentication = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const token: any = req.headers['authorization'];
        const splitToken = token.split(' ');
        if (!splitToken[1]) {
            return res.status(400).json({ message: 'invalid token' });
        }

        jwt.verify(splitToken[1], 'secret', (err: any, decode: any) => {
            if (err) {
                return res.status(401).json({ status: false, message: err.message });
            } else {
                req['uid'] = decode.userId;
                next();
            }
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};
const authorization = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const communityAdmin: any = await communityModel.findOne({ owner: req.uid });
        if (communityAdmin?.owner.toString() !== null && req.uid === communityAdmin?.owner.toString()) {
            next();
        } else {
            return res.status(403).json({ status: false, message: 'User is Not Authorized' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export default { authentication, authorization };
