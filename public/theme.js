((function(){
  location.query = new Object();
  const applyStylesheet = ( link ) => {
    let style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = link;
    document.head.appendChild( style );
  }
  window.onload = ( ) => {
    for(let q of location.search.substr(1).split("&")){
      let s = q.split("=");
      location.query[ s[0] ] = s[1];
    }
    console.log( location.query );
    document.querySelector('[name="link"]').value = location.query.style;
    applyStylesheet( location.query.style );
  }
})());