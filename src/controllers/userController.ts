import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

async function UserSignUp(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const data = req.body;
        const checkUniqEmail = await userModel.findOne({ email: email });

        if (checkUniqEmail) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: 'email',
                        message: 'User with this email address already exists.',
                        code: 'RESOURCE_EXISTS'
                    }
                ]
            });
        }

        const saltRound: number = 10;
        const salt: string = bcrypt.genSaltSync(saltRound);
        const hash: string = bcrypt.hashSync(password, salt);
        data['password'] = hash;

        const setUser = await userModel.create(data);

        if (!setUser) {
            return res.status(400).json({ status: false, message: 'bad request' });
        }
        return res.status(201).json({ status: true, message: 'Created', data: setUser });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function UserSignIn(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const checkUnique = await userModel.findOne({ email: data.email });
        if (!checkUnique) {
            return res.status(404).json({ status: false, message: 'user not exists' });
        }

        bcrypt.compare(data.password, checkUnique.password, (err, result) => {
            if (result) {
                let token = jwt.sign(
                    {
                        userId: checkUnique._id.toString(),
                        email: checkUnique.email
                    },
                    'secret',
                    { expiresIn: '2h' }
                );
                res.setHeader('authorization', token);
                res.cookie('token', token);
                return res.status(201).json({
                    status: true,
                    content: {
                        data: {
                            id: checkUnique._id.toString(),
                            name: checkUnique.name,
                            email: checkUnique.email
                        }
                    },
                    meta: {
                        access_token: token
                    }
                });
            } else {
                return res.status(401).send({
                    status: false,
                    message: 'login denied '
                });
            }
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function UserDetails(req: Request, res: Response, next: NextFunction) {
    try {
        const me = await userModel.findById(req.uid).select({ _id: 1, name: 1, email: 1, created_at: 1 });
        return res.status(200).json({ data: me });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export default { UserSignUp, UserSignIn, UserDetails };
