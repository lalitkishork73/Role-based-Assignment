import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Community } from '../../models/communityModel';
import { Member } from '../../models/memberModel';
import { Role } from '../../models/roleModel';
import { User } from '../../models/userModel';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (err: any) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: req.body,
                        message: err.message,
                        code: 'INVALID_INPUT'
                    }
                ]
            });
        }
    };
};

export const Schemas = {
    user: {
        signup: Joi.object<User>({
            name: Joi.string().required(),
            email: Joi.string()
                .regex(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
                .required(),
            password: Joi.string().required().min(6).messages({
                'string.empty': `Name should be at least 2 characters.`
            })
        }),
        signin: Joi.object<User>({
            email: Joi.string()
                .regex(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
                .required(),
            password: Joi.string().required().min(6).messages({
                'string.empty': `Name should be at least 2 characters.`
            })
        })
    },

    member: {
        addMember: Joi.object<Member>({
            community: Joi.string().required(),
            user: Joi.string().required(),
            role: Joi.string().required()
        })
    },
    role: {
        create: Joi.object<Role>({
            name: Joi.string().required().messages({
                'string.empty': `Name should be at least 2 characters.`
            })
        })
    },
    community: {
        create: Joi.object<Community>({
            name: Joi.string().required()
        })
    }
};
