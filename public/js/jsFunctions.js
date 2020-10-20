//cmntBtn

$(document).ready(function(){
    $(".cmntBtn").click(function(){
        $(".commentSection").removeClass("commentSection");
    });
});

function getTheValue() {
    var x = document.getElementById("sectionName").value;
    document.getElementById("demo").innerHTML = "You selected: " + x;
  }