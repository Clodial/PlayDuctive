//attach listeners after DOM loaded
$(function(){
    $("button").click(function () {
        $.ajax({
            url: "makeProject/posts",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                "accountName": "tkt5",
                "accountPass": "5tkt",
                "projType": $("[name=projType]").val(),
                "projName": $("[name=projName]").val(),
                "projDesc": $("[name=projDesc]").val()
            }),
            contentType: "application/json",
            mimeType: "application/json",
            success: function (result) {
                //maybe do something to the page
            }
        });
    });

    //Function checking for users
    $("#addUser").keyup(function(){
        var userPartial = document.getElementById("addUser").value;
        var useCheck = "";
        
        $.ajax({
            url: "/makeProject/search_users",
            type: "POST",
            datatype: "json",
            data: JSON.stringify({
                "userPartial": userPartial
            }),
            contentType: "application/json",
            mimeType: "application/json",
            success: function(data){
                //clear the current list
                var x = document.getElementById("userSelect");
                while (x.length > 0) {
                    x.remove(0);
                }
                //add the new elements
                for(i=0;i<data.length;i++) {
                    var option=document.createElement("option");
                    option.text=data[i];
                    x.add(option);
                }
            }
        });
    });
});
