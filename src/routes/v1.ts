import { Router } from 'express';
const router = Router();

//----- Controller modules imports
import roleController from '../controllers/roleController';
import userController from '../controllers/userController';
import communityController from '../controllers/communityController';
import memberController from '../controllers/memberController';
import Auth from '../middlewares/auth/auth';

//----- validation modules imports
import { Schemas, ValidateJoi } from '../middlewares/validations/joi';

//----- Role Routes
router.post('/role', ValidateJoi(Schemas.role.create), roleController.CreateRoles);
router.get('/role', roleController.GetAllRoles);

//----- User Routes
router.post('/auth/signup', ValidateJoi(Schemas.user.signup), userController.UserSignUp);
router.post('/auth/signin', ValidateJoi(Schemas.user.signin), userController.UserSignIn);
router.get('/auth/me', Auth.authentication, userController.UserDetails);

//----- Community Routes
router.post('/community', ValidateJoi(Schemas.community.create), Auth.authentication, communityController.CreateCommunity);
router.get('/community', communityController.GetAllCommunity);
router.get('/community/:id/members', communityController.GetAllMembers);
router.get('/community/me/owner', Auth.authentication, communityController.GetMyOwnedCommunity);
router.get('/community/me/member', Auth.authentication, communityController.GetMyJoinedCommunity);

//----- Member Routes
router.post('/member', ValidateJoi(Schemas.member.addMember), Auth.authentication, Auth.authorization, memberController.AddMember);
router.delete('/member/:id', Auth.authentication, Auth.authorization, memberController.RemoveMember);

export default router;
