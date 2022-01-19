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

app.post('/login', verifiePasAuthentification, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

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

function verifiePasAuthentificationAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
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