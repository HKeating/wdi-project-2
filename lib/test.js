const rp      = require('request-promise');
const Promise = require('bluebird');
const parser  = require('xml2json');

// google maps API key: AIzaSyAzntD6joQkWskYP1kPmI32GcxpJE-nTB8

// 1 Get duration
// 2 Search topic to return podcasts
// 3 Get feed url
// 4 Sort by closest duration to your journey

let jDuration;
const origin = '51.546,-0.103';
const destination = '51.496,-0.142';
const topic = 'football';
const limit = '5';
function searchPodcasts() {
  console.log('This is working');
  rp({
    method: 'GET',
    // url: 'https://api.tfl.gov.uk/journey/journeyresults/51.546,-0.103/to/51.496,-0.142',
    url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&key=AIzaSyAzntD6joQkWskYP1kPmI32GcxpJE-nTB8`,
    json: true
  })
  .then((data) => {
    // jDuration = (data.journeys[0].duration) * 60;
    jDuration = data.routes[0].legs[0].duration.value;
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
    console.log('Num of results', results.length);
    findClosest(jDuration, results);

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
  let curr1 = array[0];
  let curr2 = array[0];
  let curr3 = array[0];
  let diff1 = Math.abs(num - curr1.duration);
  let diff2 = Math.abs(num - curr2.duration);
  let diff3 = Math.abs(num - curr3.duration);

  for (var i = 0; i < array.length; i++) {
    if (array[i]) {
      const newDiff = Math.abs(jDuration - array[i].duration);
      if (newDiff < diff1) {
        diff1 = newDiff;
        curr1 = array[i];
      } else if (newDiff < diff2) {
        diff2 = newDiff;
        curr2 = array[i];
      } else if (newDiff < diff3) {
        diff3 = newDiff;
        curr3 = array[i];
      }
    }
  }
  closest.push(curr1, curr2, curr3);
  console.log(closest);
  return closest;
}

// function test(req, res) {
//   console.log('this is working');
//
//
// }

searchPodcasts();
module.exports = {
  search: searchPodcasts
  // test: test
};
