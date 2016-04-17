//attach listeners after DOM loaded
$(function(){
    $("button").click(function () {
        $.ajax({
            url: "makeTask/posts",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                "accountName": "AlanJ6",
                "accountPass": "lollmao01",
                "classId": $("[name=class]").val(),
				"taskExp": $("[name=taskexp]").val(),
				"taskDesc": $("[name=taskDescrip]").val()
            }),
            contentType: "application/json",
            mimeType: "application/json",
            success: function (result) {
                //maybe do something to the page
            }
        });
    });

    //Function checking for users
    $("addUser").keyup(function(){
        console.log("keyup");
    });
});
