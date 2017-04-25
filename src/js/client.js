console.log('hello world');
// const lib = require('../lib/test');


$(init);

const topics = ['Arts', 'Business', 'Comedy', 'Education', 'Football', 'Games &amp; Hobbies','Government &amp; Organisations', 'Health', 'Kids &amp; Family', 'Music', 'News &amp; Politics', 'Religion &amp; Spirituality', 'Science &amp; Medicine', 'Society &amp; Culture', 'Sports &amp; Hobbies', 'Technology', 'TV &amp; Film'];

const subtopics = {
  'Arts': ['Design', 'Fashion &amp; Beauty', 'Food', 'Literature', 'Performing Arts', 'Visual Arts'],
  'Business': ['Business News', 'Careers', 'Investing', 'Management &amp; Marketing', 'Shopping'],
  'Education': ['Educational Technology', 'Higher Education', 'Language Courses', 'Training', 'K-12'],
  'Games & Hobbies': ['Automotive', 'Aviation', 'Hobbies', 'Other Games', 'Video Games'],
  'Government & Organisations': ['Local', 'National', 'Non-Profit', 'Regional'],
  'Health': ['Alternative Health', 'Fitness &amp; Nutrition', 'Self-Help', 'Sexuality'],
  'Science & Medicine': ['Medicine', 'Natural Sciences', 'Social Sciences'], 'Society & Culture': ['History', 'Personal Journals', 'Philosophy', 'Places &amp; Travel'],
  'Sports & Hobbies': ['Amateur', 'University &amp; Secondary School', 'Outdoor', 'Professional'],
  'Technology': ['Gadgets', 'Podcasting', 'Software How-To', 'Tech News']
};

function init() {
  selectTopic();
  shadowSearch();
}

function selectTopic() {
  const topicSelector = '#topicSelector';
  const subtopicSelector = '#subtopicSelector';
  topics.forEach(topic => {
    $(`<option value="${topic}">${topic}</option>`).appendTo(topicSelector);
  });

  $(topicSelector).change(() => {
    $(subtopicSelector).empty();
    $(`<option value="" disabled selected>Choose a subtopic</option>`).appendTo(subtopicSelector);
    if (subtopics[`${$(topicSelector).val()}`]) {
      subtopics[`${$(topicSelector).val()}`].forEach(subtopic => {
        $(`<option value="${subtopic}">${subtopic}</option>`).appendTo(subtopicSelector);
      });
    }
  });
  //
  // $(subtopicSelector).change(() => {
  //
  // });
}

function shadowSearch() {
  const $origin = $('#origin');
  const $destination = $('#destination');
  $origin.blur(() => {
    $('#shadowOrigin').val($origin.val());
  });
  $destination.blur(() => {
    $('#shadowDestination').val($destination.val());
  });


}
