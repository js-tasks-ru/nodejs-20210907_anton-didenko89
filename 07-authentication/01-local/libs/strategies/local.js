const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {

      await User.findOne({ email: email }, async function (err, user) {
        if (err) { return done(err); }

        if (!user) {
          return done(null, false, 'Нет такого пользователя' );
        }

        let passwordIsValid = await user.checkPassword(password).then(isValid => isValid);

        if (!passwordIsValid) {
          return done(null, false, 'Неверный пароль');
        }

        return done(null, user);
      });
    },
);
