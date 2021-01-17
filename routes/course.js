const express = require('express')
const Course = require('../models/course')
const User = require('../models/user')
const router = express.Router()
const {isLoggedIn,  isInstructor,isStudent} = require("../middleware")
router.get('/student', isLoggedIn, isStudent, async (req,res)=> {
    const courses = await Course.find({});
    res.render('course/student_version', {courses})
})

router.get('/instructor',isLoggedIn, isInstructor, async (req,res)=> {
    const courses = await Course.find({});
    res.render('course/instructor_version', {courses})
})

router.get('/create',isLoggedIn, isInstructor, (req,res) => {
    res.render('course/create')
})
router.get('/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate('students');
    res.render('course/detail',{course})
})
router.post('/create', isLoggedIn, isInstructor,async(req,res) => {
    const {name, credits, description, capacity} = req.body;
    const course = new Course({name, credits, description, capacity});
    course.instructor_name = req.user.username;
    await course.save();
    const user = await User.findById(req.user._id);
    user.courses.push(course._id);
    await user.save()
    res.redirect('/user')
})

router.put('/:courseId/add/:studentId',isLoggedIn, isStudent ,async(req, res)=> {
    const {courseId, studentId} = req.params;
    const course = await Course.findById(courseId);
    course.students.push(studentId);
    await course.save();
    const user = await User.findById(studentId);
    user.courses.push(courseId);
    await user.save();
    res.redirect('/user')
})

router.get('/:id/update', isLoggedIn, isInstructor, async(req,res) => {
    const course = await Course.findById(req.params.id);
    res.render('course/edit', {course})
})
router.put('/:id/update', isLoggedIn, isInstructor,async(req,res) => {
    const {id} = req.params
    const {name, credits, description, capacity} = req.body;
    const course = await Course.findByIdAndUpdate(id, {name, credits, description, capacity});
    res.redirect(`/course/${id}`)
})
router.delete('/:id/delete',isLoggedIn, isInstructor, async(req,res)=>{
    const {id} = req.params;
    const course = await Course.findById(id);
    const student_ids = course.students;
    for(let student_id of student_ids) {
        const student = await User.findById(student_id);
        const index = student.courses.indexOf(id);
        student.courses.splice(index,1)
        await student.save()
    }
    await Course.findByIdAndDelete(id);
    res.redirect('/user')
}) 


router.delete('/:courseId/drop/:userId', isLoggedIn, isStudent,async(req,res)=>{
    const {courseId, userId} = req.params;
    const course = await Course.findById(courseId);
    const student_index = course.students.indexOf(userId);
    course.students.splice(student_index,1);
    await course.save();
    const user = await User.findById(userId);
    const course_index = user.courses.indexOf(courseId);
    user.courses.splice(course_index,1);
    await user.save();
    res.redirect('/user')
})

module.exports = router