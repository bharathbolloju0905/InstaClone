var express = require('express');
var router = express.Router();
const usermodel = require("../models/user");
const postModel = require("../models/post");
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(usermodel.authenticate()))
const upload = require("./multer")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/login', function (req, res, next) {
  res.render('login');
});
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await usermodel.findOne({ username: req.session.passport.user }).populate("posts");
  res.render("profile", { user });
});
router.get("/editprofile", isLoggedIn, async (req, res) => {
  const user = await usermodel.findOne({ username: req.session.passport.user });
  res.render("EDitprofile", { user });
});
router.post("/update", isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.send("NO files are updated");
  }
  const user = await usermodel.findOneAndUpdate({ username: req.session.passport.user },
    { username: req.body.username, fullname: req.body.fullname, bio: req.body.bio, profilePic: req.file.filename },
    { new: true });

  res.redirect("/profile");  
});

router.get("/posts/:id",async(req,res)=>{
  const val = new RegExp(`^${req.params.id}`,'i') ;
  const data = await usermodel.find({username:val}) ;
  res.json(data) ;

})

router.get("/feed",isLoggedIn,async(req,res)=>{
  const posts = await postModel.find().populate("user") ;  
  console.log(posts);
  
  res.render("feed",{posts});
})
router.get("/search",isLoggedIn,async(req,res)=>{

  
  res.render("search");
})


router.get("/uploadPost", isLoggedIn,(req, res) => {
  res.render("uploadpost")
})
router.post("/uploadPost", isLoggedIn, upload.single("postImage"), async (req, res) => {
  const user = await usermodel.findOneAndUpdate({ username: req.session.passport.user });
  if (!req.file) {
    res.status(404).send("Please Select a Image")
  }
  const post = await postModel.create({
    postImage: req.file.filename,
    caption: req.body.caption,
    user: user._id
  });
  user.posts.push(post._id);
  user.save();
  res.redirect("/profile")
});
//passport code for login  
router.post("/register", async (req, res) => {
  const userdata = await new usermodel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
  });
  usermodel.register(userdata, req.body.password)
    .then(function (reguser) {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile");
      });
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}));

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login")
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
