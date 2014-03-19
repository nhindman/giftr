
// var getUrl=function(pollId){return '/photos/?poll_id=' + pollId;}
var renderOnce = "false";
var Poll = Backbone.Model.extend({     
  url: "/polls",
  defaults: {
    description: "I just changed this", 
    end_date: "not yet", 
  }        
 
})

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
    // $('.scrapedImagesHover').empty();
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
    $('#new_item_url').bind('input', function() {
      $('.scraper').css("display", "block");
      $('#poll_buttons,#uploader').css("left", "-38px");
    });
    $('body').on('click', '.close-me', function() {
      console.log("CLOSE ME CLICKED")
      $('.scrapedImagesHover').toggle()
    });

    this.render()
  },

  render: function(){
    // $('.scrapedImagesHover').empty();
  },

  events: {
    // "click #go_button": "showUploaderAndScraperButtons",
    // "onchange .files": "addItemToPoll",
    "click .scraper": "scrapeImage", 
    // "click .close-me": "closeImageHover"
  }, 

  scrapeImage: function(e) {
    console.log("scraper clicked!");
    e.preventDefault();
    // if ($('#new_item_url').val().empty?){
    //   alert("Must enter valid URL")
    // }
    // $('.scrapedImagesHover').empty();
    $(".slides").html('');
    // this.createPhotos(); // could put flexslider in createPhotos as a callback like below:
    this.createPhotos(function(res){
      if(res) {
        $().flexslider({
        animation: "slide",
        slideshow: false,
        animationLoop: false,
        itemWidth: 150,
        itemMargin: 15
        });
      }
    });
  },

  createPhotos: function(callback) {
    // $('.scrapedImagesHover').empty();
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
            alert("FIRST SUCCESS PHOTOS HERE:"+photoListView)
            photoListView = new PhotoListView()
            photoListView.collection.fetch({
              url: '/photos?poll_id=' + poll.id,
              success: function(data){
                alert("SECOND SUCCESS FIRED:"+photoListView)
                  console.log()
                  console.log("create success fired")
                  // $('.scrapedImagesHover').empty();
                  makeScrapedImagesHover(data);
                  console.log(data)
                  // $('.flexslider').flexslider({
                  //   animation: "slide",
                  //   slideshow: false,
                  //   animationLoop: false,
                  //   itemWidth: 150,
                  //   itemMargin: 15
                  // });

                  return (typeof callback === "function") ? callback(data) : null 
              },
              error : function(err) {
              //console.log(err) can you this to dig deeper
              console.log("ERROR STATUS TEXT", err.statusText);
              }
            });
          } 
        })
        
        var makeScrapedImagesHover = function(data){
          $('.scrapedImagesHover').toggle();
        }
      }, 

      el: function() {
        return $('#new_item_form')
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
    // $('.scrapedImagesHover').empty();
    this.render();
  }, 

  el: $('<li>'),

  events: {
    "click .scraped_photo": 'addSelectedPhoto',
  }, 

  render: function(){
    // $('.scrapedImagesHover').html('');
    var self = this;
    console.log("photoview render fired")
    var photo = $('<img src="' + this.model.get('url') + '">');
    console.log("HEY BUDDY LOOK HERE FOR THIS.MODEL:",this.model)
    console.log("HEY BUDDY LOOK HERE FOR THE URL:",this.model.get('url'))
    $('<li>').append(photo).attr('class', 'scraped_photo').attr('id', 'item-id-'+this.model.attributes.id).appendTo($('.slides'));
    // this.$el.html(photo)
    // this.$el.attr('class', 'col-lg-3 col-md-3');
    this.resetValues();
    // console.log("render photoview this:")
    // console.log(self.$el.html())
    // $('.scrapedImagesHover').empxwwty();
    return this;
    return false;
    // $('.scrapedImagesHover').empty();
  },

  addSelectedPhoto: function(){
    this.model.save({"selected": true}, {
      success: function() {
        // $('.scrapedImagesHover').empty();
        appendSelectedPhotos(photoListView.collection);
        console.log("SUCCESS");
    },
    error: function() {
      console.log("OH, no!");
    }});
    // $('.scrapedImagesHover').empty();
    $('.scrapedImagesHover').toggle();
    // $('.scrapedImagesHover').empty();
    this.resetValues();
      
  },  

  resetValues: function() {
    // $('.scrapedImagesHover').empty();
    _.each( $('input'), function(input){
      $(input).val('');
    })
    $('.add_gift_ideas_instructions-app').animate({duration:10000,opacity:0});
    $('.what_gift_instructions-app').html('Enter another gift idea');
    // $('.scrapedImagesHover').empty();
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
    // $('.scrapedImagesHover').empty();
    this.is_buttons = is_buttons || false;
    console.log("SEEHERE",poll.id)
    console.log("SEEHERE 2",this.collection)
    this.collection = new PhotoList({
      url: '/photos?poll_id=' + poll.id
    });
    this.photoViews = []
    this.collection.fetch();
    console.log("SEEHERE 3",this.collection)
    this.listenTo(this.collection, "all", this.render)
    // $('.scrapedImagesHover').empty();
  },

  el: '.slides', 

  render: function() {
    // $('.scrapedImagesHover').empty();
    console.log("RENDER !!!" + i++, this.collection);
    var self = this;
    _.each(this.photoViews, function(view){
      view.remove();
    })
    this.photoViews = []
    
    console.log(this.collection.models.length) 
    // this.$el.empty()
    this.collection.each(function(photo){
      console.log('Different Photo ##########:')
      console.log(photo)
      // new_view = new PhotoView({
      //   model: photo
      // });
      // self.photoViews.push(new_view);
      // console.log("new_view.model.attributes:")
      // console.log(new_view.model.attributes)
      // somevar = new_view.render().$el.html()
      // console.log('######')
      // console.log(somevar)
      if(!checkForExisting(photo.attributes.url,".slides")){
      self.$el.append(new PhotoView({
        model: photo
      }).render().$el);
      }
      // $('.scrapedImagesHover').empty();
    });
  
      console.log(self.$el.html())    
    
    // $('.scrapedImagesHover').empty();  
    return this;
    // $('.scrapedImagesHover').empty();
  },

});


//this one should be initialized with a collection and used like
// initialize: function() {
//   this.collection.on('change', this.render);
// }

// var selectedView = new PhotoVoteListView({
//   collection: selectedCollection,
//   element: "#item_list"
// });


var PhotoVoteListView = Backbone.View.extend({
  initialize: function(){
    this.collection = new PhotoList();
    this.photoViews = []
    this.collection.fetch({data: {poll_id: poll.id}});
    this.listenTo(this.collection, "all", this.render)
  },
  el: function(){
    return $('#item_list')
  },
  render: function() {

    var self = this;
    _.each(this.photoViews, function(view){
      view.remove();
    })

    this.photoViews = []

    _.each(this.collection.models, function(photo){
      if (photo.attributes.selected === true) {
      var new_view = new PhotoView({
        model: photo
      });
      self.photoViews.push(new_view)
      self.$el.append(new_view.render().$el.append("<button class=\"btn btn-lg btn-danger\" data-action='vote'>Vote!</button>"))
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
  // template: function(attrs){
  //   html_string = $('#items_template').html();
  //   // console.log(html_string)
  //   var template_func = _.template(html_string)
  //   return template_func(attrs)
  // },

  resetValues: function() {
    _.each( $('input'), function(input){
      $(input).val('');
    })
    $('.add_gift_ideas_instructions-app').animate({duration:10000,opacity:0});
    $('.what_gift_instructions-app').html('Enter another gift idea');
    
  },

  render: function(){
    var self = this;
    this.$el.html(this.model.attributes);
    this.$el.attr('id', 'item-id-'+this.model.attributes.id);
    var image = this.model.attributes.url;
    var website = 'http://'+this.model.attributes.website+'/';
    // console.log(website)
    self.$el.attr('class', 'item col-lg-3 col-md-3');
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
    // var aTag = document.createElement('a');
    // aTag.setAttribute('href', '"'+website+'"');
    // aTag.innerHTML = "Gift Link";
    // self.$el.append(aTag);
    // this.resetValues();
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
      self.$el.append(new_view.render().$el.append("<button class=\"btn btn-lg btn-danger\" data-action='vote'>Vote!</button>"))
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
  window.itemVoteListView = new ItemVoteListView();
  window.photoVoteListView = new PhotoVoteListView(); 
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
      $vote_img.appendTo($('#item-id-'+vote.attributes.photo_id))
    }
  })
}

var appendSelectedPhotos = function(photos){
    console.log("APPEND selected photos fired")
    console.log(photos)
    var self = this;
    photos.each(function(photo){
      if(photo.attributes.selected === true){
        var selected_photo = $('<div>');
        selected_photo.html(photo.attributes);
        selected_photo.attr('id', 'item-id-'+photo.attributes.id);
        var image = photo.get('url');
        website = photo.get('website');
        selected_photo.attr('class', 'item col-lg-3 col-md-3');
        selected_photo.attr('style','background-image:url("'+image+'")');
        selected_photo.wrap("<a href="+website+"></a>");
        $("a").attr("target", "_blank");
        if (!checkForExisting(image,"#item_list")) {
          $('#item_list').append(selected_photo);
        }
      }
    })  
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



