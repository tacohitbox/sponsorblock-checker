const yt = require("yt-channel-info");
const {SponsorBlock} = require("sponsorblock-api");
const sb = new SponsorBlock();

console.log("- Testing https://www.youtube.com/channel/UC0AE_22J0kAo30yjasaeFqw");

yt.getChannelVideos("UC0AE_22J0kAo30yjasaeFqw").then(function(a) {
  console.log("[info] got " + a.items.length + " videos from crawler");
  if (a.items[0]) {
    sb.getSegments(a.items[0].videoId, ["interaction", "intro", "music_offtopic", "outro", "preview", "selfpromo", "sponsor"]).then(function(c) {
      console.log("[info] found " + c.length + " segments in https://youtu.be/" + a.items[0].videoId);
    }).catch(function(err) {
      console.log("[sponsorblock err]");
      console.log(err.stack);
    })
  }
}).catch(function(err) {
  console.log("[channel crawler error]");
  console.log(err.stack);
});