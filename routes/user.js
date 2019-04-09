import express from 'express';
import passport from 'passport';
import user from '../controllers/user';

const router = express.Router();

router.post('/login', user.loginWithEmail);
router.post('/', user.signUpWithEmail);

router.get('/auth/google', passport.authenticate('google', { session: false, scope: ['email', 'profile'] }));
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: 'auth/google' }), user.socialLogin);
// passport.authenticate('google', user.googleLogin)
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/auth/facebook' }), user.socialLogin);
// passport.authenticate twitter
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/auth/twitter' }), user.socialLogin);

export default router;
