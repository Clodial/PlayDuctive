
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

//Function checking if 
$("#reg-user").keyup(function(){
	var user = document.getElementById("reg-user").value;
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
		success: function(result){
			if(result)
			
		}
	});
});
