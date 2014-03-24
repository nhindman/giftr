var renderOnce = "false";
var Poll = Backbone.Model.extend({     
  url: "/polls",
  defaults: {
    description: "I just changed this", 
    end_date: "not yet", 
  }        
 
})

// $(document).ready(function() {
//   $('.flexslider').flexslider({
//     animation: "slide",
//     animationLoop: false,
//     itemWidth: 300,
//     itemMargin: 5,
//     minItems: 1,
//     maxItems: 4
//   });
// });

// var init_flexslider = function(){
//   $('.flexslider').flexslider({
//     animation: "slide",
//     slideshow: false,
//     animationLoop: false,
//     itemWidth: 150,
//     itemMargin: 15
//   });
// };

var User = Backbone.Model.extend({
  url: "/users",
})

var UserList = Backbone.Collection.extend({
  model: User, 
  url: "/users"
})

var Item = Backbone.Model.extend({
  url: '/items',

  defaults: {
    name: "not yet",
    image: "not yet",
  }
})

var ItemFormView = Backbone.View.extend({
  initialize: function(){
    console.log("initialize fires") 
    var fileupload = $('#files');
    fileupload.on('change', function(e){
      console.log("file onchange fires")  
      e.preventDefault();
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        itemsListView.collection.create({
          name: $('#new_item_name_input').val(),
          website: $('#new_item_url').val(),
          poll_id: poll.id,
          image: reader.result
        })
      });
      reader.readAsDataURL($('#files')[0].files[0]);
      return false;
    });
    $('body').on('click', '.close-me', function() {
      console.log("CLOSE ME CLICKED")
      $('.scrapedImagesHover').toggle()
    });

    this.render()
  },

  render: function(){
    // $('.scraper').on('click', function(e){
    //   scrapeImage();
    // });
  },

  events: {
    "click .scraper": "scrapeImage", 
  }, 

  scrapeImage: function(e) {
    console.log("scraper clicked!");
    e.preventDefault();
    // if ($('#new_item_url').val().empty?){
    //   alert("Must enter valid URL")
    // }
    this.createPhoto();
  },

  createPhoto: function() {
    console.log("createImage fired!");
        $.ajax({
          type: "POST",
          url: "/photos/scrap",
          data: {
            poll_id: poll.id,
            website: $('#new_item_url').val(),
            url: $('#new_item_url').val()
          },
          success: function(data) {
            console.log("HEREDATA:");
            console.log(data);
            photoListView = new PhotoListView(data);
            photoListView.render().$el.appendTo('#photos')
            makeScrapedImagesHover();
            setTimeout(function(){
            $('.flexslider').flexslider({
                      animation: "slide",
                      slideshow: false,
                      animationLoop: false,
                      itemWidth: 150,
                      itemMargin: 15,
                      directionNav: true,
                      slideToStart: 0
                      // start: function(slider) {
                      //     $('a.slide_thumb').click(function() {
                      //         $('.flexslider').show();
                      //         var slideTo = $(this).attr("rel")//Grab rel value from link;
                      //         var slideToInt = parseInt(slideTo)//Make sure that this value is an integer;
                      //         if (slider.currentSlide != slideToInt) {
                      //             slider.flexAnimate(slideToInt)//move the slider to the correct slide (Unless the slider is also already showing the slide we want);
                      //         }
                      //     });
                      // }

                  });
             },500);
            $('.flexslider').removeData("flexslider");
          } 
        })
        
        var makeScrapedImagesHover = function(){
          $('.scrapedImagesHover').show();
        }
      }, 

      el: function() {
        return $('.url_input_and_button')
      },

  })

var Photo = Backbone.Model.extend({
})

var PhotoList = Backbone.Collection.extend({
  model: Photo, 
  url: "/photos"
})

var PhotoView = Backbone.View.extend({
  initialize: function() {
    // this.render();
    var self = this;


    // $('.scraped_photo').off().on('click', function(e) {
      
    // });  
  },

  events: {
    "click .scraped_photo": 'addSelectedPhoto', 
    "click [data-action='vote']": 'vote'
    //"click .click_me": 'addSelectedPhoto',
    //"click img": 'addSelectedPhoto',
  },

  tagName: 'li',

  render: function(){
    var self = this;
    var photo = $('<img src="' + this.model.url + '">');
    var photo_item = this.$el;
    photo.addClass('scraped_photo');
    photo.attr('id', 'photo-id-'+this.model.id); 
    if ($('.flexslider').is(":visible")){   
      photo.addClass('col-lg-3').addClass('col-md-3');  
      photo_item.append(photo);
    }else{
      photo_item.addClass('click_me');
      photo.addClass('poll_show_page_photo');
      photo_item.append(photo);
    }
    this.resetValues();
    return this;
    
  },

  addSelectedPhoto: function(e) {
    console.log("!!!", this)
    $('.scrapedImagesHover').hide();
      var id = e.target.id
      //console.log("LOOKYLOOKY SELF.MODEL.id:",self.model.id);
      //console.log("LOOKYLOOKY currentTarget id",id);
      $.ajax({
          type: "PUT",
          url: "/photos/"+ this.model.id,
          data: {
            selected: true,
            poll_id: poll.id
          }, 
          success: function(data) {
            appendSelectedPhotos(data);
          console.log("SUCCESS");
          },
      });
      
      this.resetValues();
      return false;
    // console.log("addSelectedPhoto???")
    // $('.scrapedImagesHover').toggle();
    // console.log("LOOKYLOOKY:",photoListView.collection)
    // this.model.save({"selected": true}, {
    //   success: function() {
    //     appendSelectedPhotos(photoListView.collection);
    //     console.log("SUCCESS");
    // },
    // error: function() {
    //   console.log("OH, no!");
    // }});
    // this.resetValues();    
  },  

  resetValues: function() {
    _.each( $('input'), function(input){
      $(input).val('');
    })
    // $('.add_gift_ideas_instructions-app').animate({duration:10000,opacity:0});
    // $('.what_gift_instructions-app').html('Enter another gift idea');
  },
   
  vote: function(){
    var votedphoto = voteList.findWhere({user_id: user.id});
    votedphoto.attributes.photo_id = this.model.id;
    votedphoto.save({}, {
        url: "/votes/"+votedphoto.id
    });
    appendVotesToPhotos(voteList.models);
    toggleVoteOption()
  },


})

var i = 1;
var PhotoListView = Backbone.View.extend({
  initialize: function(is_buttons){
    console.log("ISBUTTONS")
    console.log(is_buttons)
    this.is_buttons = is_buttons || false;
    this.collection = new PhotoList();
    this.photoViews = []
    this.collection.fetch();
    console.log("THIS.Collection RIGHT HERE:",this.collection)
    this.listenTo(this.collection, "all", this.render);
  },

  el: '.slides',

  render: function() {
    console.log("RENDER !!!" + i++, this.collection);
    $('.slides').html('');

        if($('.flexslider').eq(0).data('flexslider')) {
          $('.flexslider').eq(0).flexslider('destroy');
        }

        if( $('.flexslider').eq(1).data('flexslider') ) {
          $('.flexslider').eq(1).flexslider('destroy');
        }

    var self = this;
    _.each(this.photoViews, function(view){
      view.remove();
    })
    this.photoViews = []
    
    this.$el.empty();  // emptying the div here before newly searched images are appended
    _.each(this.is_buttons, function(photo){
      console.log('Different Photo ##########:')
      console.log(photo)
      self.$el.append(new PhotoView({
        model: photo
      }).render().$el);
    });
  
      console.log(self.$el.html())    
    
    return this;
  },

});


var PhotoVoteListView = Backbone.View.extend({
  initialize: function(){
    this.collection = new PhotoList();
    this.photoViews = []
    this.collection.fetch({data: {poll_id: poll.id}});
    console.log("CHECKOUT this.collection", this.collection)
    this.listenTo(this.collection, "all", this.render)
  },
  el: function(){
    return $('.itemvote_list')
  },
  render: function() {

    var self = this;
    _.each(this.photoViews, function(view){
      view.remove();
    })

    this.photoViews = []
    console.log("FYEAH", this.collection)
    _.each(this.collection.models, function(photo){
      if (photo.attributes.selected === true) {
      var new_view = new PhotoView({
        model: photo.attributes
      });
      self.photoViews.push(new_view)
      self.$el.append(new_view.render().$el.append("<button class=\"poll_show_photo_button btn btn-lg btn-danger\" data-action='vote'>VOTE</button>"))
      }
    })

  }
})

var ItemList = Backbone.Collection.extend({
  model: Item, 
  url: "/items"
})

var ItemView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  events: {
    "click .delete": "deleteActivity",
    "click .edit": "enterEdit",
    "click [data-action='vote']": 'vote', 
  },

  resetValues: function() {
    console.log("resetValues called")
    _.each( $('input'), function(input){
      $(input).val('');
    })
    // $('.add_gift_ideas_instructions-app').animate({duration:10000,opacity:0});
    // $('.what_gift_instructions-app').html('Enter another gift idea');
    
  },

  render: function(){
    var self = this;
    this.$el.html(this.model.attributes);
    this.$el.attr('id', 'item-id-'+this.model.attributes.id);
    var image = this.model.attributes.url;
    var website = 'http://'+this.model.attributes.website+'/';
    self.$el.attr('class', 'item col-lg-3 col-md-3');
    if ($('.itemvote_list').is(":visible")){
      self.$el.removeClass("col-lg-3")
      self.$el.removeClass("col-md-3")
    }
    var spinner = $("<i class='fa fa-cog fa-spin img-spinner'></i>");
    this.$el.html(spinner)
    var img = $('<img>');
    img.attr('src', image);
    img.className = "hiddenImage";
    img.load(function(event){
      // console.log (website)
        spinner.remove();
        self.$el.attr('style', 'background-image:url("'+image+'")');
        self.$el.wrap("<a href="+website+"></a>");
        $("a").attr("target", "_blank");
      })
    this.resetValues();
    return this;
    },
  
  vote: function(){
    // console.log(votes.responseJSON);
    // this.$('button').remove();
    // this.$el.append('<p>You voted for me!</p>');
    var voteditem = voteList.findWhere({user_id: user.id});
    // console.log(this.model.id);
    console.log(voteditem);
    voteditem.attributes.item_id = this.model.id;
    voteditem.save({}, {
        url: "/votes/"+voteditem.id
    });
    console.log(voteList.models)
    appendVotesToItems(voteList.models);
    toggleVoteOption()
  }

})

var ItemListView = Backbone.View.extend({
  initialize: function(is_buttons){
    this.is_buttons = is_buttons || false;
    this.collection = new ItemList();
    this.itemViews = []
    this.collection.fetch({data: {poll_id: poll.id}});
    this.listenTo(this.collection, "all", this.render)
  },

  // GOING TO FIX THIS, DONT ERASE
  // create_finish_button: function () {
  //   //if two gifts exist then append button
  //   if (itemsListView.collection.length > 1) {
  //     var finished_adding_gifts_button = $('<button>Finished Adding Gifts</button>')
  //     $('#item_list').append(finished_adding_gifts_button)
  //   }
  // }, 

  el: function(){
    return $('#item_list')
  }, 

  render: function() {

    var self = this;
    _.each(this.itemViews, function(view){
      view.remove();
    })
    this.itemViews = []
    _.each(this.collection.models, function(item){
      var new_view = new ItemView({
        model: item
      });
      self.itemViews.push(new_view)
      self.$el.append(new_view.render().$el)
    })


  }
})

var ItemVoteListView = Backbone.View.extend({
  initialize: function(){
    this.collection = new ItemList();
    this.itemViews = []
    this.collection.fetch({data: {poll_id: poll.id}});
    this.listenTo(this.collection, "all", this.render)
  },

  // GOING TO FIX THIS, DONT ERASE
  // create_finish_button: function () {
  //   //if two gifts exist then append button
  //   if (itemsListView.collection.length > 1) {
  //     var finished_adding_gifts_button = $('<button>Finished Adding Gifts</button>')
  //     $('#item_list').append(finished_adding_gifts_button)
  //   }
  // }, 

  el: function(){
    return $('.itemvote_list')
  }, 

  render: function() {

    var self = this;
    _.each(this.itemViews, function(view){
      view.remove();
    })

    this.itemViews = []

    _.each(this.collection.models, function(item){
      var new_view = new ItemView({
        model: item
      });
      self.itemViews.push(new_view)
      self.$el.append(new_view.render().$el.append("<button class=\"poll_show_item_button btn btn-lg btn-danger\" data-action='vote'>VOTE</button>"))
    })

  }
})

var Vote = Backbone.Model.extend({
  url: "/votes"
})

var VoteList = Backbone.Collection.extend({
  model: Vote, 
  url: "/votes"
})

// var VoteView = Backbone.View.extend({
//   initialize: function(){
//     this.render();
//   },

//   // template: _.template($('#accomplice-view-template').html()),

//   render: function(){
//     this.$el.html(this.template(this.model.attributes));
//     return this
//   }
// });

var VoteListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, 'add', this.renderVote)
  },

  renderVote: function(vote){
    vote.view = new VoteView({model: vote});
    this.$el.prepend(vote.view.render().el);
    return this;
  }
});


var itemSetup = function (options){
  window.itemsListView = new ItemListView(options); 
  window.photoListView = new PhotoListView(options);
  window.itemformView = new ItemFormView();
  window.item = new Item();
  window.photo = new Photo(); 
}


var itemVoteSetup = function (){
  console.log("!!!! ITEM VOTE SETUP CALL!! OH NO!")
  window.itemVoteListView = new ItemVoteListView();
  window.photoVoteListView = new PhotoVoteListView({}); 
  window.itemformView = new ItemFormView();
  window.item = new Item();
  window.photo = new Photo();
  window.itemView = new ItemView({model: item});
  window.photoView = new PhotoView({model: photo})
}

var appendVotesToItems = function(votes){
  _.each(votes, function(vote){
    if(vote.attributes.item_id){
      selector = '#' + vote.attributes.id
      $vote_img = $(selector);
      id = vote.attributes.item_id
      $vote_img.appendTo($('#item-id-'+vote.attributes.item_id))
    }
  })
}

var appendVotesToPhotos = function(votes){
  _.each(votes, function(vote){
    if(vote.attributes.photo_id){
      selector = '#' + vote.attributes.id
      $vote_img = $(selector);
      id = vote.attributes.photo_id
      $vote_img.appendTo($('#photo-id-'+vote.attributes.photo_id))
    }
  })
}

var appendSelectedPhotos = function(photo){
    console.log("APPEND selected photos fired")
    console.log(photo)
    var self = this;
    // photos.each(function(photo){
      // if(photo.attributes.selected === true){
        console.log("THIS PHOTO GETTING Classed Up:",photo)
        var selected_photo = $('<div>');
        selected_photo.html(photo);
        selected_photo.attr('id', 'item-id-'+photo.id);
        var image = photo.url;
        website = photo.website;
        selected_photo.attr('class', 'item col-lg-3 col-md-3');
        selected_photo.attr('style','background-image:url("'+image+'")');
        selected_photo.wrap("<a href="+website+"></a>");
        $("a").attr("target", "_blank");
        // if (!checkForExisting(image,"#item_list")) {
          console.log("THIS PHOTO GETTING APPENDED:",selected_photo)
          $('#item_list').append(selected_photo);
        // }
      // }
    // })
    // itemVoteSetup();
    // photoVoteListView.collection.add(photo);
  }

var checkForExisting = function(url,obj){
  var itemlist = $(obj).find("div");
  var foundFlag ="false";
  _.each(itemlist, function(val, key) {
     var bg = $(val).css('background-image');
     bg = bg.replace('url(','').replace(')','');
    if(url ===bg){

      foundFlag ="true"
    }
  }); 
  if(foundFlag === "true"){
      return true; 
    }else{
      return false;
    }
}  

var toggleVoteOption = function(){
  $('#item_list button').toggleClass('hidden');
  $('#accomplice-photos button').toggleClass('hidden');
}
