// only Front-End JS can manipulate the DOM

/* Adds an active class to nav bar */
$("a").each(function(i,a){
  var path = ($(a).attr("href"));
  console.log(path);
  if (path == decodeURIComponent(
  window.location.pathname)){
    $(a).addClass("active")
  }
})

/* animate through each letter */
$.fn.retype = function(delay) {
    var el = this,
        t = el.text(),
        c = t.split(''),
        l = c.length,
        i = 0;
    delay = delay || 10;
    el.empty();
    setInterval(function(){
        if(i < l) el.text(el.text() + c[i++]);
    }, delay);
};

$('.codeAnimate').retype();

/* Syntax highlight for code */
function htmlHighlights(){
  var codeArray = document.getElementsByClassName("html");
  for(var i=0; i<codeArray.length; i++){
    var data = codeArray[i].innerHTML;
    data = data.replace(/"(.*?)"/g, '<span id="quote">"$1"</span>');
    data = data.replace(/'(.*?)'/g, "<span id='quote'>'$1'</span>");
    data = data.replace(/&lt;(.*?)=/g, '&lt;<span id="codebracket">$1</span>=');
      // data = data.replace(/&lt;(.*?)&gt;/g, '&lt;<span id="codebracket">$1</span>&gt;');
    data = data.replace(/class/g, '<span id="no">class</span>');


    // data = data.replace(/var/g, '<span class="quote">var</span>');
    // data = data.replace(/\/\/ (.*?) \n/g, '<span class="comment">//$1</span>');
    // data = data.replace(/\/\* (.*?) \*\//g, '<span class="comment">/* $1 */</span>');
    codeArray[i].innerHTML = data;
  }
}
// data = data.replace(/&lt;/g, '<span class="code-elem">&lt;</span>');

function cssHighlights(){
  var codeArray = document.getElementsByClassName("css");
  for(var i=0; i<codeArray.length; i++){
    var data = codeArray[i].innerHTML;
    data = data.replace(/"(.*?)"/g, '<span class="quote">"$1"</span>');
    data = data.replace(/'(.*?)'/g, "<span class='quote'>'$1'</span>");
    data = data.replace(/\/\* (.*?) \*\//g, '<span id="comment">/* $1 */</span>');
    codeArray[i].innerHTML = data;
  }
}

window.addEventListener("load", htmlHighlights);
window.addEventListener("load", cssHighlights);
