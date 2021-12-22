function run() {
  if (
    !document.getElementById("url").value.includes("/channel/") &&
    !document.getElementById("url").value.includes("/c/")
  ) {
    err("This seems to be an invalid link. URLs should look like <b>https://www.youtube.com/channel/[id]</b>");
  } else {
    if (window.timer) {window.timer = null;}
    document.querySelector(".main").removeAttribute("data-vidcount");
    document.querySelector(".main").removeAttribute("data-vidscanned");
    document.getElementById("if-cont").style.display = "none";
    window.timer = setInterval(function() {
      if (document.querySelector(".main").getAttribute("data-vidcount") && document.querySelector(".main").getAttribute("data-vidscanned") && document.getElementById("loader-text").innerHTML == "Scanning videos...") {
        if (document.querySelector(".main").getAttribute("data-vidscanned") == document.querySelector(".main").getAttribute("data-vidcount")) {
          document.getElementById("loader").style.display = "none";
        }
      }
    }, 100);
    document.querySelectorAll("#videolist .video-id").forEach(function(ele) {
      ele.remove();
    })
    var id = chanId(document.getElementById("url").value);
    if (id == "") {err("This seems to be an invalid link. URLs should look like <b>https://www.youtube.com/channel/[id]</b>"); return;}
    document.getElementById("loader").style.display = "block";
    document.getElementById("loader-text").innerHTML = "Sending request...";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/channel/" + id);
    xhr.send();
    xhr.onload = function() {
      document.getElementById("loader-text").innerHTML = "Scanning videos...";
      document.getElementById("videolist").style.display = "block";
      var j = JSON.parse(xhr.responseText);
      document.querySelector(".main").setAttribute("data-vidcount", (document.querySelectorAll("#videolist .video-id").length + j.items.length));
      if (j.cont) {
        document.getElementById("cont").setAttribute("data-vidid", j.cont);
        document.getElementById("if-cont").style.display = "block";
      } else {
        document.getElementById("cont").removeAttribute("data-vidid");
        document.getElementById("if-cont").style.display = "none";
      }
      for (var c in j.items) {
        var d = document.createElement("DIV");
        d.classList.add("video-id");
        d.id = j.items[c].id;
        var t = document.createElement("H4");
        t.innerHTML = j.items[c].title;
        var sb = document.createElement("CODE");
        sb.id = `sb---${j.items[c].id}`;
        sb.innerHTML = "Scanning...";
        d.append(t);
        d.append(sb);
        document.getElementById("videolist").append(d);
        scan(j.items[c].id);
      }
    }
  }
}

function err(txt) {
  document.getElementById("err").style.display = "block";
  document.getElementById("err-txt").innerHTML = txt;
}

function chanId(url) {
  if (document.getElementById("url").value.includes("/channel/")) {
    return document.getElementById("url").value.split("/channel/")[1].split("/")[0];
  } else {
    return document.getElementById("url").value.split("/c/")[1].split("/")[0];
  }
}

function lm(cont) {
  document.getElementById("loader-text").innerHTML = "Retrieving more metdata...";
  document.getElementById("loader").style.display = "block";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/channel/more?cont=" + cont);
  xhr.send();
  xhr.onload = function() {
    var j = JSON.parse(xhr.responseText);
    if (j.cont) {
      document.getElementById("cont").setAttribute("data-vidid", j.cont);
      document.getElementById("if-cont").style.display = "block";
    } else {
      document.getElementById("cont").removeAttribute("data-vidid");
      document.getElementById("if-cont").style.display = "none";
    }
    document.querySelector(".main").setAttribute("data-vidcount", (document.querySelectorAll("#videolist .video-id").length + j.items.length));
    document.getElementById("loader-text").innerHTML = "Scanning videos..."
    for (var c in j.items) {
      var d = document.createElement("DIV");
      d.classList.add("video-id");
      d.id = j.items[c].id;
      var t = document.createElement("H4");
      t.innerHTML = j.items[c].title;
      var sb = document.createElement("CODE");
      sb.id = `sb---${j.items[c].id}`;
      sb.innerHTML = "Scanning...";
      d.append(t);
      d.append(sb);
      document.getElementById("videolist").append(d);
      scan(j.items[c].id);
    }
  }
}

function scan(id) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/sb/" + id);
  xhr.send();
  xhr.onload = function() {
    var j = JSON.parse(xhr.responseText);
    document.getElementById(`sb---${id}`).innerHTML = j.length;
    if (document.querySelector(".main").getAttribute("data-vidscanned")) {var a = parseInt(document.querySelector(".main").getAttribute("data-vidscanned"));} else {var a = 0;}
    document.querySelector(".main").setAttribute("data-vidscanned", (a + 1));
    if (j.length == 0) {document.getElementById(`sb---${id}`).innerHTML = `${document.getElementById(`sb---${id}`).innerHTML} <a target="_blank" href="https://youtu.be/${id}" rel="noreferer"><button>add more</button></a>`;}
  }
}