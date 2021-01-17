const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const app = express();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ejsMate = require('ejs-mate')

const User = require('./models/user')

const userRoutes = require('./routes/user')
const courseRoutes = require('./routes/course')

mongoose.connect('mongodb://localhost:27017/Class-Begin', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})
app.use('/user', userRoutes)
app.use('/course', courseRoutes)

app.get('/', (req, res) => {
    res.render('home')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LISTEN TO PORT: ${PORT}`))