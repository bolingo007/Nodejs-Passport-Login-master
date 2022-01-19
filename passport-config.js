const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    const user = getUserByUsername(username)

    //Si aucun utilisateur a été trouvé avec le username reçu
    if (user == null) {
      return done(null, false, { message: "Ce nom d'utilisateur n'existe pas"})
    }

    try {
      //Si le mot de passe reçu est bien celui de l'utilisateur associé au username reçu
      if (await bcrypt.compare(password, user.password)) {
        //C'est le bon mot de passe, on retourne l'utilisateur
        return done(null, user)
      } else {
        return done(null, false, { message: 'Le mot de passe est invalide' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize