var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var httpRequest = require('request');

var makeApiKey = require('./makeApiKey');
var makeAuthObject = require('./makeAuthObject');
var makeAuthString = require('./makeAuthString');
var makeAugmentedAuthString = require('./makeAugmentedAuthString');
var app = require('../server-config.js');

var db = require('../app/config');
var User = require('../app/models/user');
var Match = require('../app/models/match');
var Users = require('../app/collections/users');
var Matches = require('../app/collections/matches');

var API_KEY = require('../lib/internal-files').API_KEY; 
var JWT_SECRET = require('../lib/internal-files').JWT_SECRET;
var FAKE_FB_ID = require('../lib/internal-files').FAKE_FB_ID; 


/////////////////////////////////////////////////////
// NOTE: these tests are designed for mongo!
/////////////////////////////////////////////////////

describe('', function() {

  
  describe('Authentication: ', function() {
    it('if an api key isnt present it immediately returns 404', function(done) {
      request(app)
        .get('/matches')
        .expect(404)
        .end(done);
    });
      
    it('if an api key isnt present POST to /matches should 404', function(done) {
      request(app)
        .post('/matches')
        .send({
	  'user_0_id':'1'
        })
        .expect(404)
        .end(done);
    });

    it('if an api key isnt present GET to /allcandidates should 404', function(done) {
      request(app)
        .get('/allcandidates')
        .expect(404)
        .end(done);
    });
  
    it('if a valid token isnt present GET to /matches should 404', function(done) {
      request(app)
        .get('/matches' + makeApiKey.makeApiKey())
        .expect(404)
        .end(done);
    });
 
    it('if a valid token isnt present GET to /matches should 404', function(done) {
      request(app)
        .post('/matches' + makeApiKey.makeApiKey())
        .expect(404)
        .end(done);
    });

    it('if a valid API key and token are present GET to /matches should return 200', function(done) {
      request(app)
        .get('/matches' + makeAuthString.makeAuthString(FAKE_FB_ID))
        .expect(200)
        .end(done);
    });
    
    xit('if a valid API key and token are present POST to /matches should return 200', function(done) {
      request(app)
        .post('/matches' + makeAugmentedAuthString.makeAugmentedAuthString(FAKE_FB_ID,3))
        .expect(200)
        .end(done);
    });

    it('if a valid API key and token are present GET to /allcandidates should return 200', function(done) {
      request(app)
        .get('/allcandidates' + makeAuthString.makeAuthString(FAKE_FB_ID))
        .expect(200)
        .end(done);
    });
   }); // checks for API key   

   describe('API /allcandidates:', function() {

      it('/allcandidates responds with a collection', function(done) {
        request(app)
          .get('/allcandidates' + makeAuthString.makeAuthString(FAKE_FB_ID))
          .expect(200)
          .expect(function(res) {
            expect(Array.isArray(res.body)).to.equal(true);
          })
          .end(done);
      });
      
      it('/allcandidates responds with the opposite gender', function(done) {
        request(app)
          .get('/allcandidates' + makeAuthString.makeAuthString(FAKE_FB_ID))
          .expect(200)
          .expect(function(res) {
            expect(res.body[0].is_male).to.equal(0);
          })
          .end(done);
      });
   });

   describe('API /matches:', function(){
     it('POST /matches responds with 403 if an invalid target_id is submitted', function(done){
       request(app)
         .post('/matches' + makeAugmentedAuthString.makeAugmentedAuthString(FAKE_FB_ID,-1))
         .expect(403)
         .end(done)
     });
  
     xit('POST /matches responds with 200 if a valid target_id is submitted', function(done){
       request(app)
         .post('/matches' + makeAugmentedAuthString.makeAugmentedAuthString(FAKE_FB_ID,3))
         .expect(200)
         .end(done)
     });
  });
  describe('API /matches, matching functionality:', function(){
    beforeEach(function(done) {
      request(app)
        .post('/matches' + makeAugmentedAuthString.makeAugmentedAuthString(FAKE_FB_ID,3))
        .expect(function(response){
          //console.log('response body', response.body);
        })
        .end(done);
    });
    

    it('GET /matches responds with error if a duplicate match is submitted', function(done){
      request(app)
        .post('/matches' + makeAugmentedAuthString.makeAugmentedAuthString(FAKE_FB_ID,3))
        .expect(function(response){
          expect(response.body).to.equal( "Error: already exists")
  	})
        .end(done)
     });
    
    it('GET /matches responds with a match if a valid match is submitted', function(done){
      request(app)
        .post('/matches' + makeAugmentedAuthString.makeAugmentedAuthString(3,FAKE_FB_ID))
        .expect(200)
        .expect(function(response){
            console.log(response.body);
            //expect(response.body).to.equal( "Error: already exists")
  	})
        .end(done)
     });

  });  //matching functionality

});
/*
  
      it('New links create a database entry', function(done) {
        request(app)
          .post('/links')
          .send({
            'url': 'http://www.roflzoo.com/'})
          .expect(200)
          .expect(function(res) {
            Link.findOne({'url' : 'http://www.roflzoo.com/'})
              .exec(function(err,link){
                if(err) console.log(err);
                expect(link.url).to.equal('http://www.roflzoo.com/');
              });
          })
          .end(done);
      });

      it('Fetches the link url title', function(done) {
        request(app)
          .post('/links')
          .send({
            'url': 'http://www.roflzoo.com/'})
          .expect(200)
          .expect(function(res) {
            Link.findOne({'url' : 'http://www.roflzoo.com/'})
              .exec(function(err,link){
                if(err) console.log(err);
                expect(link.title).to.equal('Rofl Zoo - Daily funny animal pictures');
              });
          })
          .end(done);
      });

    }); // 'Shortening Links'

    describe('With previously saved urls: ', function() {

      beforeEach(function(done) {
        link = new Link({
          url: 'http://www.roflzoo.com/',
          title: 'Rofl Zoo - Daily funny animal pictures',
          base_url: 'http://127.0.0.1:4568',
          visits: 0
        })

        link.save(function() {
          done();
        });
      });

      it('Returns the same shortened code if attempted to add the same URL twice', function(done) {
        var firstCode = link.code
        request(app)
          .post('/links')
          .send({
            'url': 'http://www.roflzoo.com/'})
          .expect(200)
          .expect(function(res) {
            var secondCode = res.body.code;
            expect(secondCode).to.equal(firstCode);
          })
          .end(done);
      });

      it('Shortcode redirects to correct url', function(done) {
        var sha = link.code;
        request(app)
          .get('/' + sha)
          .expect(302)
          .expect(function(res) {
            var redirect = res.headers.location;
            expect(redirect).to.equal('http://www.roflzoo.com/');
          })
          .end(done);
      });

    }); // 'With previously saved urls'

  }); // 'Link creation'

  describe('Priviledged Access:', function(){

    // /*  Authentication  
    // // TODO: xit out authentication
    it('Redirects to login page if a user tries to access the main page and is not signed in', function(done) {
      request(app)
        .get('/')
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/login');
        })
        .end(done);
    });

    it('Redirects to login page if a user tries to create a link and is not signed in', function(done) {
      request(app)
        .get('/create')
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/login');
        })
        .end(done);
    });

    it('Redirects to login page if a user tries to see all of the links and is not signed in', function(done) {
      request(app)
        .get('/links')
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/login');
        })
        .end(done);
    });

  }); // 'Privileged Access'

  describe('Account Creation:', function(){

    it('Signup creates a new user', function(done) {
      request(app)
        .post('/signup')
        .send({
          'username': 'Svnh',
          'password': 'Svnh' })
        .expect(302)
        .expect(function() {
          User.findOne({'username': 'Svnh'})
            .exec(function(err,user) {
              expect(user.username).to.equal('Svnh');
            });
        })
        .end(done);
    });

    it('Successful signup logs in a new user', function(done) {
      request(app)
        .post('/signup')
        .send({
          'username': 'Phillip',
          'password': 'Phillip' })
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/');
          request(app)
            .get('/logout')
            .expect(200)
        })
        .end(done);
    });

  }); // 'Account Creation'

  describe('Account Login:', function(){

    beforeEach(function(done) {
      new User({
          'username': 'Phillip',
          'password': 'Phillip'
      }).save(function(){
        done();
      });
    });

    it('Logs in existing users', function(done) {
      request(app)
        .post('/login')
        .send({
          'username': 'Phillip',
          'password': 'Phillip' })
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/');
        })
        .end(done);
    });

    it('Users that do not exist are kept on login page', function(done) {
      request(app)
        .post('/login')
        .send({
          'username': 'Fred',
          'password': 'Fred' })
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/login');
        })
        .end(done)
      });

  }); // Account Login

});
*/
