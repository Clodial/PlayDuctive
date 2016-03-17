$("button").click(function () {
    $.ajax({
        url: "blah",
        type: "PUT",
        dataType: "json",
        data: JSON.stringify({
            "projType":"Waterfall",
            "projName": "blah",
            "projDesc": "blah"
        }),
        contentType: "application/json",
        mimeType: "application/json",
        success: function (result) {
            //maybe do something to the page
        }
    })
});
