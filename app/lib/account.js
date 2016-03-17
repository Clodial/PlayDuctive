// account.js
// contains all of the class information and functions required
// for creating and using accounts / user information

var mysql = require('mysql');	// this is required when using the userModel object

var User = function(user, email){

	/**
	*
	*	@brief User Object function
	*	@param user -> the username of the user
	* 	@param pass -> password of the user
	*	@param email -> email of the user
	*
	**/

	//class variables
	this.username 		= user;
	this.email			= email;
	this.project 		= [];
	this.pmClass 		= 0;
	this.artClass		= 0;
	this.devClass		= 0;
	this.writClass		= 0;
	this.desClass		= 0;

}

var UserFactory = function(){} 	// main access to model for accounts
UserFactory.prototype.MakeUser = function(user, pass, email){

	/**
	*
	*	@brief creates a new account item in the database
	*	@param user -> the username for a new account
	*	@param pass -> the password to said account
	*	@param email -> the email to the account
	*
	**/

}
UserFactory.prototype.MakeClasses = function(user){
	
	/**
	*
	*	@brief creates user classes in database
	*	@param user -> username of account to create classes for
	*
	**/

}
UserFactory.prototype.GetUser = function(user, pass){

	/**
	*
	*	@brief gets account info and make a user object
	* 	@param user -> account username
	*	@param pass -> account password
	*
	**/

	var actArr = UserFactory.GetClasses(user);

}
UserFactory.prototype.GetClasses = function(user){

	/**
	*
	*	@brief gets all of the classes for a given user
	*
	**/

}

