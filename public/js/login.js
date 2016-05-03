$(".nav-login").hide();
$(".nav-register").hide();
$(".user-stats").hide();
//clicking buttons to show login and registration sections
$(".showLog").click(function(){
	if($(".nav-register").is(':visible')){
		$(".nav-register").slideToggle(500, function(){
			$(".nav-login").slideToggle(500);
		});
	}else{
		$(".nav-login").slideToggle(500);
	}
});	
$(".showReg").click(function(){
	if($(".nav-login").is(':visible')){
		$(".nav-login").slideToggle(500, function(){
			$(".nav-register").slideToggle(500);
		});
	}else{
		$(".nav-register").slideToggle(500);
	}
});	

$("#statShow").click(function(){
	$(".user-stats").slideToggle("slow");
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



