
function resetSelector(){
  $('#fs-user-list').empty();
  

  $(".mutual-friends-link").fSelector({

    max: 5,
    excludeIds: exclusions,
    facebookInvite: false,
    lang: {
      title: "Pick your mutual friends who will vote on the gifts (Last step)",
      buttonSubmit: "Add Accomplices",
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
            id: "http://shielded-sands-2955.herokuapp.com/polls/" + poll_id,
            scrape: true
          }, function(response){
            FB.ui({
            method: 'send',
            to: [accomplice],
            link: "http://shielded-sands-2955.herokuapp.com/polls/" + poll_id,
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
                } 
             }
            );
            }});
        });
      // }});
    
    },
    onClose: function(){

      // FB_notification(accomplices, poll.id);
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
var gift_idea;
var website;
var tip;
var new_view;
var mq = window.matchMedia( "(min-width: 500px)" );

$(document).ready(function() {    

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
        title: "Pick the friend whom you are buying a gift for (Step 1/3)", 
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
          poll.save(null, {success: itemSetup})
          poll.set({url: '/polls/' + this.id});
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
      onClose: function(){
        $('#recipient').attr('src', "http://graph.facebook.com/" + friend_id + "/picture?type=large").attr('width', "180px")
        setTimeout(function(){
          window.location = '/polls#secondPage'
        }, 1000);
        
      }
    });

  // This doesn't totally work yet.  Need to compare mutual friends with your own friends
  // and only return mutuals
  // $("#mutual-friends-link").fSelector({

  //   // max: 5,
  //   excludeIds: exclusions,
  //   // getStoredFriends: mutual_friends_array,
  //   facebookInvite: false,
  //   lang: {
  //     title: "Pick your mutual friends who will vote on the gifts",
  //     buttonSubmit: "Add Accomplices",
  //     selectedLimitResult: "Limit is {5} people."
  //   },
  //   closeOnSubmit: true
  // })
});




// function renderMFS() {
//  // First get the list of friends for this user with the Graph API
//  FB.api('/me/friends', function(response) {
//    var container = document.getElementById('mfs');
//    var mfsForm = document.createElement('form');
//    mfsForm.id = 'mfsForm';

//    // Iterate through the array of friends object and create a checkbox for each one.
//    for(var i = 0; i < Math.min(response.data.length, 10); i++) {
//      var friendItem = document.createElement('div');
//      friendItem.id = 'friend_' + response.data[i].id;
//      friendItem.innerHTML = '<input type="checkbox" name="friends" value="'
//        + response.data[i].id
//        + '" />' + response.data[i].name;
//        mfsForm.appendChild(friendItem);
//      }
//      container.appendChild(mfsForm);

//      // Create a button to send the Request(s)
//      var sendButton = document.createElement('input');
//      sendButton.type = 'button';
//      sendButton.value = 'Send Request';
//      sendButton.onclick = sendRequest;
//      mfsForm.appendChild(sendButton);
//    });
//  }

// var PhotoView = Backbone.View.extend({
//   initialize: function() {
//     this.render();
//   }, 
//   events: {

//   }, 
//   resetValues: function() {
//     _.each( $('input'), function(input){
//       $(input).val('');
//     })
//   }, 
//   render: function(){
//     var self = this;
//     this.$el.html(this.model.attributes);
//     this.$el.attr('id', 'item-id-'+this.model.attributes.id);
//     var image = this.model.attributes.url;
//     self.$el.attr('class', 'item col-lg-3 col-md-3');
//     var spinner = $("<i class='fa fa-cog fa-spin img-spinner'></i>");
//     this.$el.html(spinner)
//     var img = $('<img>');
//     img.attr('src', image);
//     img.className = "hiddenImage";
//     img.load(function(event){
//       // console.log (website)
//         spinner.remove();
//         self.$el.attr('style', 'background-image:url("'+image+'")');
//         // // self.$el.wrap("<a href="+website+"></a>");
//         // $("a").attr("target", "_blank");
//       })
//     this.resetValues();
//     return this;
//   }

// })


// var PhotoListView = Backbone.View.extend({
//   initialize: function(is_buttons){
//     // this.is_buttons = is_buttons || false;
//     this.collection = new PhotoList();
//     this.photoViews = []
//     this.collection.fetch({data: {item_id: item.id}});
//     this.listenTo(this.collection, "all", this.render)
//   },

//   el: function(){
//    return $('#item_list') 
//   },

//   render: function() {

//     var self = this;
//     _.each(this.photoViews, function(view){
//       view.remove();
//     })
//     this.photoViews = []
//     _.each(this.collection.models, function(photo){
//       var new_view = new PhotoView({
//         model: photo
//       });
//       self.Views.push(new_view)
//       self.$el.append(new_view.render().$el)
//     })


//   }

// })







// var PotentialRecipient = Backbone.Model.extend({

// })

// //view for form where user inputs name of gift recipient
// var FormView = Backbone.View.extend({
//   initialize: function(){

//   },

//   render: function() {

//   },

//   events: {
//     "click .search_button" : "createView"
//   },

//   createView: function(e){
//     e.preventDefault();


//   }

// })

// var PotentialRecipientList = Backbone.Collection.extend({
//   model: PotentialRecipient, 
//   url: "/potential_recipients"
// })

// var PotentialRecipientView = Backbone.View.extend({
//   initialize: function(){
//     this.render();
//   }, 

//   events: {
//     "click .show_potential_recipients_button": "showPotentialRecipients"
//   }
//   //html with images
//   template: function(attrs){
//     html_string = $('#potential_recipient_template').html();
//     var template_function = _.template(html_string)
//     return template_function(attrs)
//   }, 

//   render: function(){
//     this.$el.html(this.template(this.model.attributes));
//     return this
//   }, 

//   showPotentialRecipients: function(){
//     recipientListView.collection.add(this.model.attributes)
//     var html_string
//   }

// })



//======================= Trying to build sticky scrolling ====================================

$(window).load(function(e) {
  $('.site-wrapper a').on('click', scrollToInformation);
});

function scrollToInformation(event) {
  event.preventDefault();
  var diff = $(document).height() - $(window).height();
  var dest = ($(this).offset().top > diff) ? diff : $(this).offset().top;
  if (dest <= 480) { dest = 0; }
  $('html, body').animate({scrollTop: dest - 53}, 800, 'swing');
}
