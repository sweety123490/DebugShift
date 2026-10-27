import express from 'express';
import {
  getChallenges,
  getChallengeById,
  getChallengeHint,
} from '../controllers/challengeController.js';

const router = express.Router();

router.get('/', getChallenges);
router.get('/:id', getChallengeById);
router.get('/:id/hint', getChallengeHint);

export default router;
