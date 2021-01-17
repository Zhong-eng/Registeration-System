const express = require('express')
const User = require('../models/user')
const passport = require('passport');
const router = express.Router()
const {isLoggedIn} = require("../middleware")
router.get('/', isLoggedIn ,async(req, res) => {
    const user = await User.findById(req.user._id).populate("courses");
    res.render("user/index",{user})
})

router.get('/register', (req,res)=>{
    res.render('user/register')
})
router.post('/register',async (req,res, next) => {
    const { username, email, password, occupation } = req.body;
    const user = new User({username, email, occupation})
    const registerdUser = await User.register(user, password)
    req.logIn(registerdUser, err => {
        if (err) return next()
        res.redirect('/user')
    })
})

router.get('/login', (req,res)=> {
    res.render('user/login')
})
router.post('/login',passport.authenticate('local', {failureRedirect: '/user/login' }), async (req, res) => {
    console.log(req.user)
    res.redirect('/user');
})

router.get('/logout', isLoggedIn ,(req,res) => {
    req.logout();
    res.redirect('/')
})


module.exports = router