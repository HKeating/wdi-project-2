// const podcastSearch = require('../lib/test');


function journeysNew(req, res) {
  res.render('journeys/new');
}

// function search() {
//   podcastSearch.searchPodcasts();
// }

module.exports = {
  new: journeysNew
  // search: search
};
