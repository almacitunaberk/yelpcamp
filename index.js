const express = require('express');
const expressSession = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const UserModel = require('./models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const campgroundRouter = require('./routes/campgroundRoutes');
const reviewRotuer = require('./routes/reviewRoutes');
const userRouter = require('./routes/userRoutes');

const path = require('path');

connectDB();

const app = express();

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(
  expressSession({
    secret: process.env.SESSION_KEY,
    store: MongoStore.create({
      dbName: '_yelpcamp_store',
      mongoUrl: process.env.MONGODB_URL,
      touchAfter: 24 * 3600,
      secret: process.env.SESSION_KEY,
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 30,
      maxAge: 1000 * 60 * 30,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use(morgan('tiny'));
app.use(mongoSanitize());

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
  'https://kit-free.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
  'http://cdn.jsdelivr.net/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'data:', 'https://source.unsplash.com/', 'https://images.unsplash.com/'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.set('view engine', 'ejs');
app.set('views directory', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/fakeUser', async (req, res) => {
  const user = new UserModel({
    email: 'tuna@tuna.com',
    username: 'tunaaaaa',
  });
  const newUser = await UserModel.register(user, 'tunatuna');
  res.send(newUser);
});

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRotuer);
app.use('/', userRouter);

app.all('*', (req, res, next) => {
  next(new ExpressError('Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong!';
  req.flash('error', 'Something went wrong!');
  res.render('./error', { err });
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});
