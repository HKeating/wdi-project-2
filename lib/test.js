const rp      = require('request-promise');
const Promise = require('bluebird');
const parser  = require('xml2json');

// 1 Get duration
// 2 Search topic to return podcasts
// 3 Get feed url
// 4 Sort by closest duration to your journey

let jDuration;
rp({
  method: 'GET',
  url: 'https://api.tfl.gov.uk/journey/journeyresults/51.546,-0.103/to/51.496,-0.142',
  json: true
})
.then((data) => {
  jDuration = (data.journeys[0].duration) * 60;
  console.log('Duration', jDuration)

  return rp({
    method: 'GET',
    url: 'https://itunes.apple.com/search?term=football&media=podcast&country=gb&limit=50',
    json: true
  });
})
.then(data => {
  return Promise.map(data.results, (podcast) => {
    // console.log(podcast.feedUrl);
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
          duration: standardiseTime(episode['itunes:duration'])
        };
      });
    } catch (e) {
      return;
    }
  });
  // Now to sort by some algorithm yo.
  results = [].concat.apply([], results);
  console.log(results.length);
  let closest = results[0];
  let diff = Math.abs(jDuration - closest.duration);
  for (var i = 0; i < results.length; i++) {
    if (results[i]) {
      const newDiff = Math.abs(jDuration - results[i].duration);
      if (newDiff < diff) {
        diff = newDiff;
        closest = results[i];
      }
    }
  }
  console.log(closest);
  // for (var i = 0; i < results.length; i++) {
  //   console.log(results[i]);
  // }

})
.catch(err => {
  console.log(err);
  return process.exit();
});

// // Three different time formats that I am aware of
// const test1 = '00:42:55';
// const test2 = '42:55';
// const test3 = '1843';
//
// console.log(standardiseTime(test1));
// console.log(standardiseTime(test2));
// console.log(standardiseTime(test3));

function standardiseTime(time) {
  if (time.length === 7 || time.length === 8) {
    const times = time.split(':');
    return ((parseInt(times[0])*3600) + (parseInt(times[1])*60) + (parseInt(times[2])));
  } else if (time.length === 5){
    const times = time.split(':');
    return ((parseInt(times[0])*60) + (parseInt(times[1])));
  } else if (time.length <= 4){
    return parseInt(time);
  } else {
    console.log('Error: invalid duration format', time);
  }
}
