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