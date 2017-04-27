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

  addTopics();
  shadowSearch();
  searchAllowed();
  $('select').material_select();
  $('#description').val('');
  $('#description').trigger('autoresize');
  $('.collapsible').collapsible();
  // $('.carousel').carousel();
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    centerMode: true,
    focusOnSelect: true
  });

}

function addTopics() {
  const topicSelector = '#topicSelector';
  const subtopicSelector = '#subtopicSelector';
  topics.forEach(topic => {
    $(`<option value="${topic}">${topic}</option>`).appendTo(topicSelector);
  });

  $(topicSelector).change(() => {
    $(`${subtopicSelector} #subtopic`).remove();
    if (subtopics[`${$(topicSelector).val()}`]) {
      // for some reason this process is breaking the subtopic selector select option...
      subtopics[`${$(topicSelector).val()}`].forEach(subtopic => {
        $(`<option id="subtopic" value="${subtopic}">${subtopic}</option>`).appendTo(subtopicSelector);
      });

      $('#subtopicSelector').material_select();
    }
  });
}


function searchAllowed() {
  const $origin = $('#origin');
  const $destination = $('#destination');
  const topicSelector = '#topicSelector';
  $(topicSelector).change(() => {
    if ($origin.val() && $destination.val()) $('.searchPods').prop('disabled', false);
  });
}

function shadowSearch() {
  const $origin = $('#origin');
  const $destination = $('#destination');
  $origin.blur(() => {
    // console.log($origin.val());
    $('#shadowOrigin').val($origin.val());
  });
  $destination.blur(() => {
    $('#shadowDestination').val($destination.val());
  });
}
