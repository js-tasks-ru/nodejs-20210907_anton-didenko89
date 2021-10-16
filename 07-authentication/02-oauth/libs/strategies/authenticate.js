const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  console.log(email, displayName);

  if (!email) return done(null, false, `Не указан email`);

  await User.findOne({ email: email }, async function (err, user) {
    if (err) return done(err);

    if (!user) {
      user = await User.create({email: email, displayName: displayName}, function(error, user) {
        if(error) return done(error);

        return done(null, user);
      });
    }

    return done(null, user);
  });
};
