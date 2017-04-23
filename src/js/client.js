console.log('hello world');


// $
//   .get('https://itunes.apple.com/search?term=football&media=podcast&country=gb')
//   .done(data => {
//     console.log(data);
//   })
//   .fail(err => {
//     console.log(err);
//   });



$
  .get('https://api.tfl.gov.uk/journey/journeyresults/51.546,-0.103/to/51.496,-0.142')
  .done(data => {
    console.log(data.journeys[0].duration);
  });
