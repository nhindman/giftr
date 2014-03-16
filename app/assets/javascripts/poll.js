
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
    })
    this.render()
  },

  render: function(){

  },

  events: {
    // "click #go_button": "showUploaderAndScraperButtons",
    // "onchange .files": "addItemToPoll",
    "click .scraper": "scrapeImage"
  }, 
  
  showUploaderAndScraperButtons: function(){
    console.log("showUploaderAndScraperButtons fired")
    // $('#uploader').toggle();
    // $('.selector').toggle();
    // $('#OR_word').toggle();
    // $('#go_button').css("visibility", "hidden")
  },

  scrapeImage: function(e) {
    console.log("scraper clicked!");
    e.preventDefault();
    // if ($('#new_item_url').val().empty?){
    //   alert("Must enter valid URL")
    // }
    this.createPhoto();
    // $('#gift-one').remove()
    // $('#gift-two').remove()
    // $('#gift-three').remove()
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
          success: function() {
            photoListView.collection.fetch({
              url: '/photos?poll_id=' + poll.id,
              success: function(data){
                  console.log("create success fired")
                  makeScrapedImagesHover(data);
                  console.log(data)
                  $('.flexslider').flexslider({
                    animation: "slide",
                    slideshow: false,
                    animationLoop: false,
                    itemWidth: 150,
                    itemMargin: 15
                  });    
              }
            });
          } 
        })
        
        var makeScrapedImagesHover = function(data){
          // $('.scrapedImagesHover').empty();
          $('.scrapedImagesHover').toggle();
        }
      }, 

      el: function() {
        return $('#new_item_form')
      },

  })

var Photo = Backbone.Model.extend({
  url: "/photos",
})

var PhotoList = Backbone.Collection.extend({
  model: Photo, 
  url: "/photos"
})

var PhotoView = Backbone.View.extend({
  initialize: function() {
    this.render();
  }, 
  events: {
    // "click [data-action='vote']": 'vote',
  }, 
  resetValues: function() {
    _.each( $('input'), function(input){
      $(input).val('');
    })
  }, 
  render: function(){
    var self = this;
    console.log("photoview render fired")
    var photo = $('<img src="' + this.model.get('url') + '">');
    photo.attr('class', 'scraped_photo');
    this.$el.html(photo);
    this.$el.attr('id', 'item-id-'+this.model.attributes.id);
    this.$el.attr('class', 'col-lg-3 col-md-3');
    // photoListView.collection.each(function(scraped_image) {
    //   console.log("each ditto function fired")
    //   // self.$el.html(scraped_image);
    //   var image = scraped_image.get('url');
    //   console.log("hollerrrrrr scraped_image:")
    //   console.log(scraped_image)
    //   console.log("hollerrrrrr image:")
    //   console.log(image)
    //   var website = 'http://'+scraped_image.get('website')+'/';
    //   self.$el.attr('id', 'item-id-'+scraped_image.id);
    //   self.$el.attr('class', 'item col-lg-3 col-md-3');
    //   var spinner = $("<i class='fa fa-cog fa-spin img-spinner'></i>");
    //   self.$el.html(spinner);
    //   var img = $('<img>');
    //   img.attr('src', image);
    //   img.className = "hiddenImage";
    //   // img.load(function(event){
    //     spinner.remove();
    //     self.$el.attr('style', 'background-image:url("'+image+'")');
    //     self.$el.wrap("<a href="+website+"></a>");
    //     $("a").attr("target", "_blank");
    //   // })
    // })
    this.resetValues();
    console.log("render photoview this:")
    console.log(self.$el.html())
    return this;

  }, 
  vote: function(){
    var votedphoto = voteList.findWhere({user_id: user.id});
    votedphoto.attributes.photo_id = this.model.id;
    votedphoto.save({}, {
        url: "/votes/"+votedphoto.id
    });
    appendVotesToPhotos(voteList.models);
    toggleVoteOption()
  }

})

var i = 1;
var PhotoListView = Backbone.View.extend({
  initialize: function(is_buttons){
    this.is_buttons = is_buttons || false;
    this.collection = new PhotoList({
      url: function() {
        var pollId = poll.id;
        console.log(poll.id);
       '/photos/?poll_id=' + pollId;
      }
    });
    this.photoViews = []
    this.collection.fetch();
    this.listenTo(this.collection, "all", this.render)
  },

  el: '.scrapedImagesHover',

  render: function() {
    console.log("RENDER !!!" + i++, this.collection);
    var self = this;
    _.each(this.photoViews, function(view){
      view.remove();
    })
    this.photoViews = []
    
    console.log(this.collection.models.length)   
    _.each(this.collection.models, function(photo){
      console.log('Different Photo ##########:')
      console.log(photo)
      new_view = new PhotoView({
        model: photo
      });
      self.photoViews.push(new_view);
      console.log("new_view.model.attributes:")
      console.log(new_view.model.attributes)
      somevar = new_view.render().$el.html()
      console.log('######')
      console.log(somevar)
      self.$el.append(new_view.render().$el)
    });

      console.log(self.$el.html())    
    

    return this;
  }

})

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
      var new_view = new PhotoView({
        model: photo
      });
      self.photoViews.push(new_view)
      self.$el.append(new_view.render().$el.append("<button class=\"btn btn-lg btn-danger\" data-action='vote'>Vote!</button>"))
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

var toggleVoteOption = function(){
  $('#item_list button').toggleClass('hidden');
  $('#accomplice-photos button').toggleClass('hidden');
}



