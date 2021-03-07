const LocalStatergy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");
function init(passport) {
  passport.use(
    new LocalStatergy(
      { usernameField: "email" },
      async (email, password, done) => {
        // Login
        // Check if email exist in db
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            message: "No user with this email found",
          });
        }

        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, { message: "Logged in succesfully" });
            }
            return done(null, false, { message: "Wrong Details" });
          })
          .catch((err) => {
            return done(null, false, { message: "Something went wrong!" });
          });
      }
    )
  );

  // This method store user id in session after sucessfully logged in
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    // when we do req.user we get login user the user
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });


}

module.exports = init;
