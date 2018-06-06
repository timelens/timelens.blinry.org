// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    $("iframe").each(function() {
        $(this).timelens();
    });
}

$(function(){
    $(".timelens-standalone").each(function() {
        $(this).timelens();
    });
});
