var addedUsers=[$("submit[name=user]").attr("value")];
//attach listeners after DOM loaded
$(function(){
    /*$("button").click(function () {
        $.ajax({
            url: "makeProject/posts",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                "projType": $("[name=projType]").val(),
                "projName": $("[name=projName]").val(),
                "projDesc": $("[name=projDesc]").val(),
                "userList": addedUsers
            }),
            contentType: "application/json",
            mimeType: "application/json",
            success: function (result) {
                //maybe do something to the page, like reload or go to the new project page
            }
        });
    });*/

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
        if(addedUser!="") {
            addedUsers.push(addedUser);
            //$("#userList").append(addedUser+"<br>");
            var userElement=document.createElement("input");
            userElement.value=addedUser;
            userElement.name="addedUsers[]";
            userElement.readonly="readonly";
            document.getElementById("projectForm").appendChild(userElement);
            document.getElementById("projectForm").appendChild(document.createElement("br"));
            $("#userSelect option").filter(function(){
                return $.trim($(this).text()) ==  addedUser;
            }).remove();
        }
    });
});
