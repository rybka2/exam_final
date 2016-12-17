"use strict";

window.onload = createWindowWidthElement;
window.onresize = displayWindowWidth;

function createWindowWidthElement() {
  var windowWidthElement = document.createElement('div');
  windowWidthElement.id = 'dimension';
  windowWidthElement.style.position = "fixed";
  windowWidthElement.style.bottom = "20px";
  windowWidthElement.style.right = "20px";
  windowWidthElement.style.background = (document.documentMode < 9) ? "#777" : "rgba(42, 43, 46, 0.8)"
  windowWidthElement.style.color = "white";
  windowWidthElement.style.fontSize = "24px";
  windowWidthElement.style.padding = "5px 10px";
  windowWidthElement.style.borderRadius = "5px";
  windowWidthElement.style.webkitUserSelect = "none";
  windowWidthElement.style.UserSelect = "none";
  windowWidthElement.style.cursor = "default";
  document.body.appendChild(windowWidthElement);
  displayWindowWidth();
}

function displayWindowWidth() {
  var windowWidth, trueWindowWidth = 0, outputWidth = "";
  if( typeof( window.innerWidth ) == 'number' ) {
    windowWidth = window.innerWidth;
  } else if( document.documentElement && document.documentElement.clientWidth ) {
    windowWidth = document.documentElement.clientWidth;
  }
  if( document.body && document.body.clientWidth ) {
    trueWindowWidth = document.body.clientWidth;
  }
  (windowWidth === trueWindowWidth) ? outputWidth = windowWidth : outputWidth = windowWidth + " (" + trueWindowWidth + ")";
  document.getElementById("dimension").innerHTML = outputWidth;
}

