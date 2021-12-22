const yt = require("yt-channel-info");
const ex = require("express");
const {SponsorBlock} = require("sponsorblock-api");
const sb = new SponsorBlock();
const {parse} = require("url");
const app = ex();

app.use(ex.static("static/"));
app.listen((process.env.PORT || 8080), function () {
  console.log(`Listening on port ${(process.env.PORT || 8080)}.`)
});

app.get("/api/channel/:id", async function(req, res) {
  if (parse(req.url, true).query.cont) {
    var a = (await yt.getChannelVideosMore(parse(req.url, true).query.cont));
  } else {
    var a = (await yt.getChannelVideos(req.params.id));
  }

  var b = [];
  for (var c in a.items) {
    b.push({
      title: a.items[c].title,
      id: a.items[c].videoId
    });
  }

  res.send({
    items: b,
    cont: a.continuation
  });
});

app.get("/api/sb/:id", function(req, res) {
  sb.getSegments(req.params.id, [
    "interaction",
    "intro",
    "music_offtopic",
    "outro", 
    "preview", 
    "selfpromo", 
    "sponsor"
  ]).then(function(c) {
    res.send(c);
  }).catch(function(err) {
    res.send([]);
  })
});

app.all("*", function(req, res) {
  res.sendFile(`${__dirname}/static/404.html`);
});