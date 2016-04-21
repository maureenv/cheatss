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
function syntaxHighlights(){
  var codeArray = document.getElementsByTagName("pre");
  for(var i=0; i<codeArray.length; i++){
    var data = codeArray[i].innerHTML;
    data = data.replace(/"(.*?)"/g, '<span class="quote">"$1"</span>');
    data = data.replace(/&lt;(.*?)&gt;/g, '<span class="code-elem">&lt;$1&gt;</span>');
    data = data.replace(/\/\//g, '<span class="comment">//</span>');
    codeArray[i].innerHTML = data;
  }
}

window.addEventListener("load", syntaxHighlights);
