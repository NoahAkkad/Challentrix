const AppleStrategy = require('passport-apple').Strategy;

passport.use(new AppleStrategy(
    {
        clientID: process.env.APPLE_CLIENT_ID, 
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID, 
        privateKey: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
        callbackURL: process.env.APPLE_CALLBACK_URL, 
        passReqToCallback: false, 
    },
    async (accessToken, refreshToken, idToken, profile, done) => {

    console.log('Profile:', profile)

    const user = {
        id: profile.sub, 
        email: profile.email, 
    }

    return done(null, user)
}
))
