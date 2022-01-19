if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
app.use(express.static('public'));
const { passwordStrength } = require('check-password-strength');
app.set("view engine", "pug");

//d
const moment = require("moment");

app.use(express.json());

const MAX_ATTEMPTS = 3; // after which the account should be locked
const LOCK_WINDOW = 1; // in minutes

let lock = {
  attempts: 0,
  isLocked: false,
  unlocksAt: null,
};

let locks = {};
//f
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

let users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({
  extended: false
}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', verifieAuthentification, (req, res) => {
  /* //d
  console.log(passwordStrength('aaaaAAA111/').id);
  console.log(passwordStrength('aaaaAAA111/').value);
  //f */

  res.render('accueil.pug', {
    username: req.user.username
  })
})

app.get('/login', verifiePasAuthentification, (req, res) => {
  res.render('login.pug')
})

app.post('/login', verifiePasAuthentificationLogin, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

/* app.post('/login', verifiePasAuthentification, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})) */

app.get('/register', verifiePasAuthentification, (req, res) => {
  res.render('register.pug')
})

app.get('/admin', verifiePasAuthentificationAdmin, (req, res) => {
  res.render('admin.pug')
})


app.post('/register', verifiePasAuthentification, async (req, res) => {
   const Outform = JSON.parse(JSON.stringify(req.body)) // pour retirer "[Object: null prototype]" de req.body

    if (passwordStrength(Outform.password).id < 2){
      return res.render('register',  {
            error: 'Veuillez re-saisir le mot de passe car il est faible'
          }
        )
    }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.session.destroy();
  
  //users = []; //pour supprimer tous les utilisateurs
  req.logOut();
  res.redirect('/login')
})

/* app.delete('/logout', (req, res) => {
  req.session.destroy();
  
  for( let i = 0; i < users.length; i++){
    if ( users[i].username === req.user.username) {
      users.splice(i, 1); //pour supprimer tous l'utilisateur courant
    }
  }
  
  req.user = null;
  //users = []; //pour supprimer tous les utilisateurs
  req.logOut();
  res.redirect('/login')
}) */

app.get('/logout', (req, res) => {
  req.session.destroy();

  //users = []; //pour supprimer tous les utilisateurs
  req.logOut();
  res.redirect('/login')
})

function verifieAuthentification(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function verifiePasAuthentification(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

function verifiePasAuthentificationLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  if (!req.isAuthenticated()) {
    return res.render('/register', {
      error: "SVP, veuillez entrer le bon username/password."
    });
  }
  

  //  try {
    const { username, password } = JSON.parse(JSON.stringify(req.body));

    if (!username || !password) {
      return res.json({
        error: true,
        message: "SVP entrez le username et le password pour continuer",
        status: 400,
      });
    }
    if (
      locks[username] &&
      locks[username].isLocked &&
      locks[username].unlocksAt > new Date()
    )
      return res.status(401).json({
        error: true,
        message:
          "Compte bloqué à cause de plusieurs tentatives. Le compte sera débloqué dans " +
          moment(locks[username].unlocksAt).fromNow(),
      });

    // Not recommended ^^
    // let isValid = username == "test@gmail.com" && password == "complex_password";
    let isValid = false;
    for( let i = 0; i < users.length; i++){
      if ( users[i].username === username && users[i].password === password) {
        isValid = true
      }
    }

    //If the login attempt is invalid
    if (!isValid) {
      locks[username] = lock;
      locks[username].attempts += 1;
      if (locks[username].attempts >= MAX_ATTEMPTS) {
        var d = new Date();
        d.setMinutes(d.getMinutes() + LOCK_WINDOW);
        locks[username].isLocked = true;
        locks[username].unlocksAt = d;
      }
      return res.render('/register', {
        error: "SVP, veuillez entrer le bon username/password."
      })
      /* return res.status(401).json({
        error: true,
        message:
          "SVP, veuillez entrer le bon username/password."+
          <a href="/login">Se connecter</a>
      }); */
    }

    delete locks[username];
    next()
    // return res.send("Authentication success");
  /* } catch (err) {
    console.error("Login error", err);
    next();
    return res.status(500).json({
      error: true,
      message:
        "Sorry, couldn't process your request right now. Please try again later.",
    });
  } */
  
}

function verifiePasAuthentificationAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/admin')
}

// CEST LA QUE CA BOGUE PROBABLEMENT:

app.get('/Afrique', verifiePasAuthentificationAdmin, (req, res) => {
  res.render('Afrique.pug', {
    username: req.user.username
  })
})

app.get('/Amerique', verifiePasAuthentificationAdmin, (req, res) => {
  res.render('Amerique.pug', {
    username: req.user.username
  })
})

app.get('/Asie', verifiePasAuthentificationAdmin, (req, res) => {
  res.render('Asie.pug', {
    username: req.user.username
  })
})

app.get('/Europe', verifiePasAuthentificationAdmin, (req, res) => {
  res.render('Europe.pug', {
    username: req.user.username
  })
})

app.get('/Historique', verifiePasAuthentificationAdmin, (req, res) => {
  res.render('Historique.pug', {
    username: req.user.username
  })
})



app.listen(3000)