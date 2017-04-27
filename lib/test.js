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
const numOfResults = 10;
let originText;
let destinationText;
let origin;
let destination;


function searchPodcasts(req, res) {

  const journeyId = req.body.journey;
  console.log(req.body.journey);
  Journey
  .findById(journeyId)
  .exec()
  .then(journey => {
    console.log('journey in then function', journey);
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

    console.log(origin, destination, 'Origin and destination');

    let topicText = req.body.topic;
    if (typeof(topicText) !== 'string') {
      topicText = topicText[1];
    }
    const topic = topicText.replace(/\s/g, '+');
    const limit = '5';

    rp({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&key=AIzaSyAzntD6joQkWskYP1kPmI32GcxpJE-nTB8`,
      json: true
    })
    .then((data) => {
      console.log(data);
      jDuration = data.routes[0].legs[0].duration.value;
      journeyTime = parseInt(jDuration/60);
      console.log('Journey duration: ', jDuration)
      return rp({
        method: 'GET',
        url: `https://itunes.apple.com/search?term=${topic}&media=podcast&country=gb&limit=${limit}`,
        json: true
      });

    })
    .then(data => {
      console.log('YOU ARE GETTING TO THIS POINT');
      return Promise.map(data.results, (podcast) => {
        return new Promise((resolve) => {
          // One of the problems is triggering at this point - getting Error 406 - '406 - Client browser does not accept the MIME type of the requested page.</h2>\r\n  <h3>The page you are looking for cannot be opened by your browser because it has a file name extension that your browser does not accept.'
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
      // console.log(data);
      let results = data.map(xml => {
        try {
          return JSON.parse(parser.toJson(xml));
        } catch (e) {
          return false;
        }
      })
      .filter(Boolean)
      .map(channel => {
        // console.log(channel);
        return {
          title: channel.rss.channel.title,
          episodes: channel.rss.channel.item,
          image: channel.rss.channel['itunes:image'].href
        };
        // console.log('channel item', channel.rss.channel.item);



      });

      // Now to sort by some algorithm yo.
      results = [].concat.apply([], results);
      // console.log(results[1].episodes[0]);

      const tweakedEpisodes = results[0].episodes.map(episode => {
        try {
          return {
            title: episode.title,
            duration: standardizeTime(episode['itunes:duration']),
            link: episode.enclosure.url,
            pubdate: episode['pubDate']
          };
        } catch (e) {
          return;
        }
      });
      console.log(tweakedEpisodes);
        // create a new variable and map resultt.episode into it rather than changing the results array

        // result.episodes.map(episode => {
          // return {
          //   title: episode.title,
          //   duration: standardizeTime(episode['itunes:duration']),
          //   link: episode.enclosure.url,
          //   pubdate: episode['pubDate']
          // };
        // });
        // console.log('first episode in each result', result.episodes[0]);

      // console.log('standardized: ', results[0].episodes[0]);
      // const standardizedResults = standardizeEpisodes(results);
      // console.log('standardized: ', standardizedResults);
      console.log('Num of results', results.length);
      const closest = findClosest(jDuration, results);
      // console.log(closest);

      // console.log('***************first closest log****************',closest);
      res.render('journeys/show', { closest, originText, destinationText, journeyTime });
    })
    .catch(err => {
      console.log('Its this error thats triggering', err);
      return process.exit();
    });
  });
}
// function searchPodcasts(req, res) {
//
//   const journeyId = req.body.journey;
//   console.log(req.body.journey);
//   Journey
//   .findById(journeyId)
//   .exec()
//   .then(journey => {
//     console.log('journey in then function', journey);
//     if(journey) {
//       originText = journey.origin;
//       destinationText = journey.destination;
//     } else {
//       originText = req.body.origin;
//       destinationText = req.body.destination;
//
//     }
//
//     origin = originText.replace(/\s/g, '+') + '+london';
//     destination = destinationText.replace(/\s/g, '+') + '+london';
//     return journey;
//   })
//   .then(() => {
//
//     console.log(origin, destination, 'Origin and destination');
//
//     let topicText = req.body.topic;
//     if (typeof(topicText) !== 'string') {
//       topicText = topicText[1];
//     }
//     const topic = topicText.replace(/\s/g, '+');
//     const limit = '5';
//
//     rp({
//       method: 'GET',
//       url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&key=AIzaSyAzntD6joQkWskYP1kPmI32GcxpJE-nTB8`,
//       json: true
//     })
//     .then((data) => {
//       console.log(data);
//       jDuration = data.routes[0].legs[0].duration.value;
//       journeyTime = parseInt(jDuration/60);
//       console.log('Journey duration: ', jDuration)
//       return rp({
//         method: 'GET',
//         url: `https://itunes.apple.com/search?term=${topic}&media=podcast&country=gb&limit=${limit}`,
//         json: true
//       });
//
//     })
//     .then(data => {
//       console.log('YOU ARE GETTING TO THIS POINT');
//       return Promise.map(data.results, (podcast) => {
//         return new Promise((resolve) => {
//           // One of the problems is triggering at this point - getting Error 406 - '406 - Client browser does not accept the MIME type of the requested page.</h2>\r\n  <h3>The page you are looking for cannot be opened by your browser because it has a file name extension that your browser does not accept.'
//           return rp({
//             method: 'GET',
//             url: podcast.feedUrl,
//             json: true
//           })
//           .then(data => {
//             return resolve(data);
//           })
//           .catch(err => {
//             if (err) console.log('BAD'.red);
//             return resolve('');
//           });
//         });
//       });
//     })
//     .then(data => {
//       console.log(data);
//       let results = data.map(xml => {
//         try {
//           return JSON.parse(parser.toJson(xml));
//         } catch (e) {
//           return false;
//         }
//       })
//       .filter(Boolean)
//       .map(channel => {
//         try {
//           // Just in case the format is whack
//           return channel.rss.channel.item.map(episode => {
//             // console.log(episode.enclosure.url);
//             return {
//               podcast: channel.rss.channel.title,
//               image: channel.rss.channel['itunes:image'].href,
//               title: episode.title,
//               duration: standardizeTime(episode['itunes:duration']),
//               link: episode.enclosure.url,
//               pubdate: episode['pubDate']
//             };
//           });
//         } catch (e) {
//           return;
//         }
//       });
//       // Now to sort by some algorithm yo.
//       results = [].concat.apply([], results);
//       // console.log(results);
//       console.log('Num of results', results.length);
//       const closest = findClosest(jDuration, results);
//       res.render('journeys/show', { closest, originText, destinationText, journeyTime });
//     })
//     .catch(err => {
//       console.log('Its this error thats triggering', err);
//       return process.exit();
//     });
//   });
// }

// // Three different time formats that I am aware of
// const test1 = '00:42:55';
// const test2 = '42:55';
// const test3 = '1843';
//
// console.log(standardiseTime(test1));
// console.log(standardiseTime(test2));
// console.log(standardiseTime(test3));

function standardizeEpisodes(array) {
  try {
    // Just in case the format is whack
    // return array.map(channel => {
    // console.log('this is a channel', channel);
    return array.map(episode => {
      // console.log(episode.enclosure.url);
      // console.log('this is an episode', episode);
      return {
        title: episode.title,
        duration: standardizeTime(episode['itunes:duration']),
        link: episode.enclosure.url,
        pubdate: episode['pubDate']
      };
    });
    // });

  } catch (e) {
    return;
  }
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
    console.log('Error: invalid duration format', time);
  }
}

function findClosest(num, array) {
  const closest = [];
  let curr = array[0];
  // let diff = Math.abs((num - curr.duration) || 1000);
  for (var y = 0; y < array.length; y++) {
    // console.log(newDiff, array[y].duration, 'diffs and durations');
    if (array[y]) {
      const newDiff = Math.abs(num - array[y].duration);
      if (closest.length < numOfResults) {
        // console.log(y, newDiff, 'first 4');
        curr = array[y];
        closest.push({ podcast: curr, diff: newDiff });
        array.splice(y, 1);
      } else {
        // console.log(closest);
        for (var i = 0; i < closest.length; i++) {
          // console.log(y, i, newDiff, array[y].duration, 'diffs and durations');
          // as soon as you find something that result is shorter than, find largest diff in array and kick it out. Or set up new variable for largest currently encountered diff and only do kicking out at the end.
          if(newDiff < closest[i].diff) {
            curr = array[y];
            closest.splice(i, 1);
            closest.push({ podcast: curr, diff: newDiff });
            array.splice(y, 1);
            i = closest.length;
          }
        }
      }
    }
  }
  console.log(closest);
  return closest;
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
