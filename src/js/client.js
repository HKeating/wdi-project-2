console.log('hello world');
// const lib = require('../lib/test');


$(init);

const topics = ['Arts', 'Business', 'Comedy', 'Education', 'Games &amp; Hobbies','Government &amp; Organisations', 'Health', 'Kids &amp; Family', 'Music', 'News &amp; Politics', 'Religion &amp; Spirituality', 'Science &amp; Medicine', 'Society &amp; Culture', 'Sports &amp; Hobbies', 'Technology', 'TV &amp; Film'];

function init() {
  topicSelector();
}

function topicSelector() {
  topics.forEach(topic => {
    $(`<option value="${topic}">${topic}</option>`).appendTo('#podcastSelector');
  });
}
