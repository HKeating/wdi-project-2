const rp      = require('request-promise');
const Promise = require('bluebird');
const parser  = require('xml2json');
const Journey = require('../models/journey');

// google maps API key: AIzaSyAzntD6joQkWskYP1kPmI32GcxpJE-nTB8

// 1 Get duration
// 2 Search topic to return podcasts
// 3 Get feed url
// 4 Sort by closest duration to your journey

let jDuration;
let journeyTime;
// const numOfResults = 10;
let originText;
let destinationText;
let origin;
let destination;


function searchPodcasts(req, res) {

  const journeyId = req.body.journey;
  Journey
  .findById(journeyId)
  .exec()
  .then(journey => {
    if(journey) {
      originText = journey.origin;
      destinationText = journey.destination;
    } else {
      originText = req.body.origin;
      destinationText = req.body.destination;
    }
    origin = originText.replace(/\s/g, '+') + '+london';
    destination = destinationText.replace(/\s/g, '+') + '+london';
    return journey;
  })
  .then(() => {
    let topicText = req.body.topic;
    if (typeof(topicText) !== 'string') {
      topicText = topicText[1];
    }
    const topic = topicText.replace(/\s/g, '+');
    const limit = '25';
    rp({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&key=AIzaSyAzntD6joQkWskYP1kPmI32GcxpJE-nTB8`,
      json: true
    })
    .then((data) => {
      jDuration = data.routes[0].legs[0].duration.value;
      journeyTime = parseInt(jDuration/60);
      return rp({
        method: 'GET',
        url: `https://itunes.apple.com/search?term=${topic}&media=podcast&country=gb&limit=${limit}`,
        json: true
      });
    })
    .then(data => {
      return Promise.map(data.results, (podcast) => {
        return new Promise((resolve) => {
          return rp({
            method: 'GET',
            url: podcast.feedUrl,
            json: true
          })
          .then(data => {
            return resolve(data);
          })
          .catch(err => {
            if (err) console.log('BAD'.red);
            return resolve('');
          });
        });
      });
    })
    .then(data => {
      let results = data.map(xml => {
        try {
          return JSON.parse(parser.toJson(xml));
        } catch (e) {
          return false;
        }
      })
      .filter(Boolean)
      .map(channel => {
        try{
          const items = (((((channel || {}).rss) || {}).channel) || []).item;
          const episodes = items.map(episode => {
            try {
              return {
                title: episode.title,
                duration: standardizeTime(episode['itunes:duration']),
                diff: Math.abs(jDuration - standardizeTime(episode['itunes:duration'])),
                link: episode.enclosure.url,
                pubdate: episode['pubDate']
              };
            } catch (e) {
              return;
            }
          }).sort((a, b) => {
            return parseFloat(a.diff) - parseFloat(b.diff);
          })
          .filter(Boolean);
          return {
            title: channel.rss.channel.title,
            episodes,
            image: channel.rss.channel['itunes:image'].href
          };
        } catch (e) {
          return false;
        }
      });
      results = [].concat.apply([], results);
      req.flash('info', `Your journey from ${originText} to ${destinationText} will take ${journeyTime} minutes, enjoy your podcasts:`);
      res.render('journeys/show', { results, originText, destinationText, journeyTime });
    })
    .catch(err => {
      return process.exit();
    });
  });
}

function standardizeTime(time) {
  const times = time.split(':');
  if (times.length === 3) {
    return ((parseInt(times[0])*3600) + (parseInt(times[1])*60) + (parseInt(times[2])));
  } else if (times.length === 2){
    return ((parseInt(times[0])*60) + (parseInt(times[1])));
  } else if (times.length === 1){
    return parseInt(times[0]);
  } else {
    return null;
  }
}

















// function findClosest(num, array) {
//   const closest = [];
//   let curr = array[0];
//   // let diff = Math.abs((num - curr.duration) || 1000);
//   for (var y = 0; y < array.length; y++) {
//     // console.log(newDiff, array[y].duration, 'diffs and durations');
//     if (array[y]) {
//       const newDiff = Math.abs(num - array[y].duration);
//       if (closest.length < numOfResults) {
//         // console.log(y, newDiff, 'first 4');
//         curr = array[y];
//         closest.push({ podcast: curr, diff: newDiff });
//         array.splice(y, 1);
//       } else {
//         // console.log(closest);
//         let currentLargest = 0;
//         for (var i = 0; i < closest.length; i++) {
//           // console.log(y, i, newDiff, array[y].duration, 'diffs and durations');
//           // as soon as you find something that result is shorter than, find largest diff in array and kick it out. Or set up new variable for largest currently encountered diff and only do kicking out at the end.
//           if(newDiff < closest[i].diff) {
//             curr = array[y];
//             if(closest[i].diff <= closest[currentLargest].diff) {
//               currentLargest = i;
//               if(i === closest.length) {
//                 closest.splice(currentLargest, 1);
//                 closest.push({ podcast: curr, diff: newDiff });
//                 array.splice(y, 1);
//               }
//             }
//           } else if(i === closest.length) {
//             closest.splice(currentLargest, 1);
//             closest.push({ podcast: curr, diff: newDiff });
//             array.splice(y, 1);
//           }
//         }
//       }
//     }
//   }
//   console.log(closest);
//   return closest;
// }

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
