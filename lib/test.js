const rp      = require('request-promise');
const Promise = require('bluebird');
const parser  = require('xml2json');

// 1 Get duration
// 2 Search topic to return podcasts
// 3 Get feed url
// 4 Sort by closest duration to your journey

let duration;
rp({
  method: 'GET',
  url: 'https://api.tfl.gov.uk/journey/journeyresults/51.546,-0.103/to/51.496,-0.142',
  json: true
})
.then((data) => {
  duration = data.journeys[0].duration;
  console.log('Duration', duration)

  return rp({
    method: 'GET',
    url: 'https://itunes.apple.com/search?term=football&media=podcast&country=gb&limit=50',
    json: true
  });
})
.then(data => {
  return Promise.map(data.results, (podcast) => {
    return rp({
      method: 'GET',
      url: podcast.feedUrl,
      json: true
    });
  });
})
.then(data => {
  let results = data.map(xml => {
    return JSON.parse(parser.toJson(xml));
  }).map(channel => {
    try {
      // Just in case the format is whack
      return channel.rss.channel.item.map(episode => {
        return {
          title: episode.title,
          duration: episode['itunes:duration']
        };
      });
    } catch (e) {
      return;
    }
  });

  // Now to sort by some algorithm yo.
  results = [].concat.apply([], results);
  console.log(results.length);
})
.catch(err => {
  console.log(err);
  return process.exit();
});
