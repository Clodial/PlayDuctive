var addedUsers=[];
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

                //add all the users

            }
        });
    });

    //Function checking for users
    $("#addUser").keyup(function(){
        var userPartial = document.getElementById("addUser").value;
        
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
                possibleUsers=JSON.parse(data);
                var defaultOption=document.createElement("option");
                defaultOption.selected="selected";
                defaultOption.style="display:none";
                x.add(defaultOption);
                for(i=0;i<possibleUsers.length;i++) {
                    if(addedUsers.indexOf(possibleUsers[i][0])==-1) {
                        console.log(addedUsers);
                        console.log(possibleUsers[i][0]);
                        console.log(addedUsers.indexOf(possibleUsers[i]));
                        var option=document.createElement("option");
                        option.text=possibleUsers[i][0];
                        x.add(option);
                    }
                }
            }
        });
    });

    $("#userSelect").change(function() {
        var addedUser=document.getElementById("userSelect").value;
        console.log("Adding: "+addedUser);
        addedUsers.push(addedUser);
        console.log(addedUsers);
        $("#userSelect option[value='"+addedUser+"']").remove();
    });
});
