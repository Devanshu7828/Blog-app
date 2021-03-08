const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
function authController() {
  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash(("error", info.message));
          return next(err);
        }
        if (!user) {
          req.flash(("error", info.message));
          return res.redirect("/login");
        }

        req.login(user, (err) => {
          if (err) {
            req.flash(("error", info.message));
            return next(err);
          }

          return res.redirect("/");
        });
      })(req, res, next);
    },

    register(req, res) {
      res.render("auth/register");
    },
    async postregister(req, res) {
      const { name, email, password } = req.body;
      // Validate request
      if (!name || !email || !password) {
        req.flash("error", "All field are required");

        req.flash("name", name);
        req.flash("email", email);
        return res.render("auth/register");
      }

      // check if email exist
      User.exists({ email: email }, async (err, result) => {
        if (result) {
          req.flash("error", "Email alredy taken");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }

        // hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a user in db
        const user = new User({
          name,
          email,
          password: hashPassword,
        });

        user
          .save()
          .then((user) => {
            // Login automaticaly

            return res.redirect("/");
          })
          .catch((err) => {
            req.flash("error", "Something went wrong");
            return res.redirect("/register");
          });
      });
    },
    logout(req, res) {
      req.logout();
      return res.redirect("/");
    },
  };
}

module.exports = authController;
