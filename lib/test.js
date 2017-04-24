const rp      = require('request-promise');
const Promise = require('bluebird');
const parser  = require('xml2json');

// google maps API key: AIzaSyAzntD6joQkWskYP1kPmI32GcxpJE-nTB8

// 1 Get duration
// 2 Search topic to return podcasts
// 3 Get feed url
// 4 Sort by closest duration to your journey

let jDuration;
const numOfResults = 4;

function searchPodcasts(req, res) {
  const origin = '51.546,-0.103';
  const destination = '51.496,-0.142';
  const topic = req.body.topic;
  const limit = '1';
  console.log('This is working');
  rp({
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&key=AIzaSyAzntD6joQkWskYP1kPmI32GcxpJE-nTB8`,
    json: true
  })
  .then((data) => {
    // jDuration = data.routes[0].legs[0].duration.value;
    jDuration = 3000;
    console.log('Duration', jDuration)

    return rp({
      method: 'GET',
      url: `https://itunes.apple.com/search?term=${topic}&media=podcast&country=gb&limit=${limit}`,
      json: true
    });
  })
  .then(data => {
    return Promise.map(data.results, (podcast) => {
      // console.log(podcast);
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
          // console.log(episode.enclosure.url);
          return {
            podcast: channel.rss.channel.title,
            title: episode.title,
            duration: standardizeTime(episode['itunes:duration']),
            link: episode.enclosure.url
          };
        });
      } catch (e) {
        return;
      }
    });
    // Now to sort by some algorithm yo.
    results = [].concat.apply([], results);
    // console.log(results);
    console.log('Num of results', results.length);
    const closest = findClosest(jDuration, results);
    res.render('journeys/show', { closest });
  })
  .catch(err => {
    console.log(err);
    return process.exit();
  });
}

// // Three different time formats that I am aware of
// const test1 = '00:42:55';
// const test2 = '42:55';
// const test3 = '1843';
//
// console.log(standardiseTime(test1));
// console.log(standardiseTime(test2));
// console.log(standardiseTime(test3));

function standardizeTime(time) {
  if (time.length >= 6 && time.length <= 8) {
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

function findClosest(num, array) {
  const closest = [];
  let curr = array[0];
  let diff = Math.abs(num - curr.duration);
  for (var y = 0; y < array.length; y++) {
    const newDiff = Math.abs(num - array[y].duration);
    // console.log(newDiff, array[y].duration, 'diffs and durations');
    if (array[y]) {
      if (closest.length < numOfResults) {
        console.log(y, newDiff, 'first 4');
        curr = array[y];
        closest.push({ podcast: curr, diff: newDiff });
        array.splice(y, 1);
      } else {
        console.log(closest);
        for (var i = 0; i < closest.length; i++) {
          console.log(y, i, newDiff, array[y].duration, 'diffs and durations');
          if(newDiff < closest[i].diff) {
            diff = newDiff;
            curr = array[y];
            closest.splice(i, 1);
            closest.push({ podcast: curr, diff: newDiff });
            array.splice(y, 1);
          }
        }
      }
    }
  }
  console.log(closest);
  return closest;
}

function test(req, res) {
  console.log('this test is working');
  const blah = 'blah';
  res.render('journeys/show', { blah });
}

// searchPodcasts();
module.exports = {
  search: searchPodcasts,
  test: test
};
