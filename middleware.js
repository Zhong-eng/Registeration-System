const {courseSchema, userSchema} = require('./schema.js')
const Course = require('./models/course')
const User = require('./models/user')
const alert = require('alert')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        alert("Please Log In to Continue!")
        return res.redirect('/');
    }
    next();
}


module.exports.isInstructor = async (req, res, next) => {
    const  userId  = req.user._id;
    const user = await User.findById(userId);
    if (user.occupation !== "Instructor") {
        alert("You are not permitted to do so!")
        return res.redirect("/user");
    }
    next();
}

module.exports.isStudent = async (req, res, next) => {
    const  userId  = req.user._id;
    const user = await User.findById(userId);
    if (user.occupation !== "Student") {
        alert("You are not permitted to do so!")
        return res.redirect("/user");
    }
    next();
}