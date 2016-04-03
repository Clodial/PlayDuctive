$(".nav-login").slideUp();
$(".nav-register").slideUp();
$(".user-stats").slideUp();
//clicking buttons to show login and registration sections
$(".showLog").click(function(){
	if($(".nav-login").is(':visible')){
		$(".nav-login").slideUp();
	}else{
		$(".nav-login").slideDown();
	}
	if($(".nav-register").is(':visible')){
		$(".nav-register").slideUp();
	}
});	
$(".showReg").click(function(){
	if($(".nav-register").is(':visible')){
		$(".nav-register").slideUp();
	}else{
		$(".nav-register").slideDown();
	}
	if($(".nav-login").is(':visible')){
		$(".nav-login").slideUp();
	}
});	

//Function checking if passwords match up
var passCheck = function(){
	var pass = document.getElementById("reg-pass").value;
	var pass2 = document.getElementById("reg-pass2").value;
	var checker = document.getElementById("pass-check");
	var regButton = document.getElementById("reg-button");
	if(pass != pass2){
		regButton.disabled = true;
		checker.innerHTML = "invalid password";
	}else{
		regButton.disabled = false;
		checker.innerHTML = "valid password";
	}
}

//Function for getting full user project list

//Function checking if user is valid
$("#reg-user").keyup(function(){
	var user = document.getElementById("reg-user").value;
	var regButton = document.getElementById("reg-button");
	var useCheck = "";
	$.ajax({
		url: "/login/usetest",
		type: "POST",
		datatype: "json",
		data: JSON.stringify({
			"user": user
		}),
		contentType: "application/json",
		mimeType: "application/json",
		success: function(data){
			document.getElementById("user-check").innerHTML = data + " username";
			if(data == "invalid"){
				regButton.disabled = true;
			}else{
				regButton.disabled = false;
			}
		}
	});
});

//Function to logout user
$("#logout-button").click(function(){
	$.ajax({
		url: "/login/logout",
		type: "GET",
		datatype: "json",
		data: JSON.stringify({
			"user": user
		}),
		contentType: "application/json",
		mimeType: "application/json",
		success: function(data){
			
		}
	});
})

if($("nav-log-true").is(":hover")){
	$(".user-stats").slideDown();
}else{
	$(".user-stats").slideUp();
}


