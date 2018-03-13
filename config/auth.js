// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth': {
    'clientID': '605452393131923', // your App ID
    'clientSecret': 'b6648370783a6a41d10735b4d49f6f5e', // your App Secret
    'callbackURL': 'http://localhost:8080/auth/facebook/callback',
    'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    'profileFields': ['id', 'email', 'name'] // For requesting permissions from Facebook API
  },

  'twitterAuth': {
    'consumerKey': 'fiNzDdQL8RdazehUxVnxGT57E',
    'consumerSecret': 'vrtuGX6RsXyLkwCR3KXfQ28X7DMW91AGR6yTpWReKIcL2Ci489',
    'callbackURL': 'http://localhost:8080/auth/twitter/callback'
  },

  'googleAuth': {
    'clientID': '962976135636-48ncs7038lfi0mh0l1i5t852v098cdh2.apps.googleusercontent.com',
    'clientSecret': 'KVN6t5KLiIM-LRhNIiraFSzd',
    'callbackURL': 'http://localhost:8080/auth/google/callback'
  }

};

