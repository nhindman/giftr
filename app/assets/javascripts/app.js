
function resetSelector(){
  $('#fs-user-list').empty();
  

  $(".mutual-friends-link").fSelector({

    max: 5,
    excludeIds: exclusions,
    facebookInvite: false,
    lang: {
      title: "Pick mutual friends to vote on the gift ideas",
      buttonSubmit: "Finished Adding Accomplices",
      selectedLimitResult: "Limit is {5} people."
    },
    closeOnSubmit: true,
    onSubmit: function(response){
      var accompliceUid;
      accomplices = response;
      $('#index-accomplices').empty()
      var i = 0

      var FB_notification = function(accomplice, poll_id){
        FB.api('https://graph.facebook.com/', 'post', {
            id: "http://getgiftr.herokuapp.com/polls/" + poll_id,
            scrape: true
          }, function(response){
            FB.ui({
            method: 'send',
            to: [accomplice],
            link: "http://getgiftr.herokuapp.com/polls/" + poll_id,
            redirect_uri: window.location.host+"/polls/"+poll_id
            }, fbCallback)
          })
        }

      var fbCallback = function(){
        console.log(i++)
        if (i === accomplices.length){
          window.location = "/polls/" + poll.id
        }
      }
        _.each(accomplices, function(accomplice){
          $('#index-accomplices').append('<img class="accomplices" src="http://graph.facebook.com/' + accomplice + '/picture?type=large">');
          
          user = new User({uid: accomplice});
          user.save(null,
            {success: function(response){
              console.log("users saved")
              console.log(response.attributes.uid);
              vote = new Vote();
              vote.save({
                user_id: response.attributes.id, 
                poll_id: poll.id, 
                image_url: "http://graph.facebook.com/" + response.attributes.uid + "/picture"
                },{success: function(response){
                  FB_notification(accomplice, poll.id);
                  $('.mutual-friends-link').hide()
                } 
             }
            );
            }});
        });
    }
  });
}


var mutual_friends_array = [];
var my_friends = [];
var exclusions;
var friend_attrs;
var accomplices;
var recipient_name;
var poll;
var user;
var vote;
var photo;
var gift_idea;
var tip;
var new_view;
var mq = window.matchMedia( "(min-width: 500px)" );

$(document).ready(function() {    
 // alert($("[data-website]").length);
 $('body').on('click','.noscroll', function(event) {
    var theHref = $(this).attr('href');
    window.open(theHref);
  });

  $('.go_to_2ndpage').on('click', function(){
      $.ajax({
        type: "PUT", 
        url: "/polls/"+poll.id,
        data: {
          occasion: $('#occasion_input').val()
        }, 
        success: function(data) {
          window.location = '/polls#secondPage'
        }
      });

  });  

  antiGrav('.block');

  var user_id; 
  var friend_id;
  var mutual_url;

  $.ajaxSetup({ cache: true });
  $.getScript('//connect.facebook.net/en_US/all.js', function(){
    FB.init({
      appId: '561575507272927',
    });     
    $('#loginbutton,#feedbutton').removeAttr('disabled');

    FB.getLoginStatus(function(response){
      user_id = response.authResponse.userID
      FB.api('/me/friends', function(response){
        _.each(response.data, function(friend){
          my_friends.push(parseInt(friend.id))
        });
        
      });
      // $(".bt-fs-dialog").click()
    });

  });
  
  $(".giftee").fSelector({
      max: 1,
      facebookInvite: false,
      lang: {
        title: "Pick the friend you're buying a gift for", 
        buttonSubmit: "Add Gift Recipient", 
        selectedLimitResult: "You can only select one gift recipient at a time."
      },
      closeOnSubmit: true,
      onSubmit: function(response){
        friend_id = response[0];

        mutual_url = '/' + user_id + '/mutualfriends/' + friend_id;
        FB.api( '/'+friend_id, function(response) {
          poll = new Poll({recipient_name: response.name, 
                          recipient_photo: "http://graph.facebook.com/" + friend_id + "/picture?type=large", 
                          recipient_fb_id: friend_id, 
                          description: "This Worked!", 
                          end_date: "not yet"
                        });
          poll.save(null, {success:itemSetup}) 
          poll.set({url: '/polls/' + this.id});
          //occasion button is only added if a recipient has been selected and if not select a friend button remains
          if (typeof poll.attributes.recipient_fb_id != "undefined"){
            onClose(response);
          }
        });

        // This sets up an array containing ids of mutual friends with your
        // chosen gift recipient.
        // As of now does not work for more than 99 mutual friends
        FB.api(mutual_url, function (mutuals) {
              if (mutuals && !mutuals.error) {
                _.each(mutuals.data, function(friend){
                  mutual_friends_array.push(parseInt(friend.id))
                });
                exclusions = _.difference(my_friends, mutual_friends_array);
              }
            resetSelector();
        });
      },
    });

  });

//======================= Trying to build sticky scrolling ====================================

$(window).load(function(e) {
  $('.site-wrapper a').on('click', scrollToInformation);

  $('.block').on('click', function(){
          window.location = '/#secondPage'
  });
  $('.block_2').on('click', function(){
          window.location = '/#3rdPage'
  });
  $('.block_3').on('click', function(){
          window.location = '/#lastPage'
  });
  $('.selection-page-section-2-arrow').on('click', function(){
          window.location = '/polls#3rdPage'
  });
});

//adds occasion button and input field
function onClose(response){
  console.log("MYPOLL2",poll)
  friend_id = poll.attributes.recipient_fb_id;
  console.log("FRIEND_ID YOOOO",poll.attributes.recipient_fb_id);
  console.log("POLL ID YOOOO",poll.id);
  // if (typeof poll.id != "undefined"){
    $('#recipient').attr('src', "http://graph.facebook.com/" + friend_id + "/picture?type=large").attr('width', "180px")
    $('.giftee').toggleClass('hidden')
    $('.occasion_container').append("<h1 class='whats_the_occasion_text'>What's the occasion?</h1>")
    $('.occasion_container').append("<input type='text' class='form-control' id='occasion_input' name='new_occasion_input' placeholder='Enter The Occasion (e.g., Birthday)' onfocus='this.placeholder=''' onfocusout='this.placeholder='Enter Gift URL''>")
    $('.go_to_2ndpage').show();
  // }
};

function scrollToInformation(event) {
  event.preventDefault();
  var diff = $(document).height() - $(window).height();
  var dest = ($(this).offset().top > diff) ? diff : $(this).offset().top;
  if (dest <= 480) { dest = 0; }
  $('html, body').animate({scrollTop: dest - 53}, 800, 'swing');
}
