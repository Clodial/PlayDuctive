$("button").click(function () {
    $.ajax({
        url: "create_project/posts",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
            "accountName": "tkt5",
            "accountPass": "5tkt",
            "projType": $("projType").val(),
            "projName": $("projName").val(),
            "projDesc": $("projDesc").val()
        }),
        contentType: "application/json",
        mimeType: "application/json",
        success: function (result) {
            //maybe do something to the page
        }
    });
});
