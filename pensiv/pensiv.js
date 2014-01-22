

if (Meteor.isClient) {


/*
################
###  ROUTER  ###
################
*/
Meteor.Router.add({
  '/': 'hello',
  '/search':'searchpage',
  '/results':'searchresults',
  '/lists':'listpage',
  '/swipetest':'swipetest',
  '*': '404'
});


/*
##############
###  DATA  ###
##############
*/
Meteor.subscribe("thoughts");
Meteor.subscribe("hashtags");
  



/*
################
###  STREAM  ###
################
*/
Template.thoughtstream.events({
  'click a.quicktag' : function (event) {
    // template data, if any, is available in 'this'
    var hashtag = event.currentTarget.innerText;
    console.log(hashtag);

    var pensiv = document.getElementById("thepensiv");
    var current = pensiv.value;
    console.log(current);
    if (current != ""){
      document.getElementById("thepensiv").value = current+" " + hashtag + " "; 
    }else{
      document.getElementById("thepensiv").value = hashtag + " "; 

    }
    pensiv.focus();
    moveCaretToEnd(pensiv);
  },

  'click .publishbtn' : function(event){
    var thepensiv = document.getElementById("thepensiv");
    var thought = thepensiv.value;
    console.log("written thought: "+thought);
    var tags = thought.match(/\S*#(?:\[[^\]]+\]|\S+)/g);
    console.log(tags);
    var tagids = [];
    var statusstr="Published: "
    for (tag in tags){
      var match = Hashtags.findOne({name:tags[tag]});
      console.log("New tag: "+match);
      if (match == null){
        console.log("No match found, creating new tag instance");
        var newtag = Hashtags.insert({name:tags[tag],created:Date.now()});
        tagids.push(newtag);
      }else{
        tagids.push(match._id);
        console.log("Match found: "+match);
      }
      statusstr = statusstr+"<b>"+tags[tag]+"</b>&nbsp;"

    }
    var a = Thoughts.insert({user:Meteor.userid,text:thought,hashtags:tagids,created:Date.now()});
    console.log("New user:"+a);
    thepensiv.value = "";
    document.getElementById("status").innerHTML=statusstr;
  },

  'click #search' : function(event){
    console.log("Trying to render");
    Meteor.Router.to('/search');
  }
});



/*
####################
###  SEARCHPAGE  ###
####################
*/
Template.searchpage.events({

  'click .homebtn':function(){
    Meteor.Router.to("/");
  },
  'click .listbtn':function(){
    Meteor.Router.to("/lists");
  },
  'keypress #tagsearch':function(){

    if (event.which == 13 || event.keyCode == 13){
      var testbool = true;
      var terms = document.getElementById("tagsearch").value.split(/[ ,]+/);
      var newTerms  = [];
      for (i in terms){
        console.log(terms[i]);
        if (terms[i][0] == "#"){
          console.log("Adding to newTerms...");
          console.log("Test");
          var tag = Hashtags.findOne({name:terms[i]});
          console.log("tag found? "+tag);
          if (tag != null){
             newTerms.push(tag._id);
             console.log(tag._id);
          }else{
            testbool = false;
          }
        }
      }
      if (newTerms.length != 0){
        console.log("Redirecccccccting");
        console.log("newterms"+newTerms);
        Session.set('terms',newTerms);
        Meteor.Router.to('/results');
        Template.searchpage.status = '';

      } else {
        if (testbool == false){
          document.getElementById('statusdiv').innerText = "No postings with that hashtag were found.";
        } else {
          console.log("No hashtags found");
          var now = document.getElementById('statusdiv').innerText;
          if (now=== 'We didn\'t find any hashtags there. Try, try again.'){
            document.getElementById('statusdiv').innerText = "Nope, still no hashtags there.";
          }else if (now == 'Nope, still no hashtags there.'){
            document.getElementById('statusdiv').innerText = "Really? Three times?";
          }else if (now == "Really? Three times?"){
            document.getElementById('statusdiv').innerText = "Tip: hashtags start with '#'.";
          }else if (now == "Tip: hashtags start with '#'."){
            document.getElementById('statusdiv').innerText = "I give up.  You're impossible.";
          }else if (now == "I give up.  You're impossible."){
            document.getElementById('statusdiv').innerText = "Goodbye.";
          }else if (now == "Goodbye."){
            document.getElementById('statusdiv').innerText = "";
          }else{
            console.log('1');
            document.getElementById('statusdiv').innerText = 'We didn\'t find any hashtags there. Try, try again.';
          }
          console.log("Changed");
          //Meteor.Router.to('/search');
        }  
      }
    }
  }
});




/*
#######################
###  SEARCHRESULTS  ###
#######################
*/
Template.searchresults.rendered = function(){
    window.mySwipe = Swipe(document.getElementById('slider'));
}

Template.searchresults.results = function(){
  console.log("TERMS:" +Session.get("terms"));
  var allMatch = Thoughts.find({hashtags:{$all:Session.get("terms")}});
  var oneMatch = Thoughts.find({hashtags:{$in:Session.get("terms")}});
  console.log(allMatch);
  return allMatch;
};

Template.searchresults.events({
  'click #searchbtn': function(){
    Template.searchpage.status = '';
    Meteor.Router.to('/search');
  }


});


}

/*
###################
###  FUNCTIONS  ###
###################
*/
function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}






/*
#####################
###  SERVER CODE  ###
#####################
*/
if (Meteor.isServer) {
  Meteor.publish('thoughts', function() {
    var results = Thoughts.find({userid:this.userId},{sort: {created: -1}});
    return results;
  });

  Meteor.publish('hashtags',function(){
    return Hashtags.find({});
  });
}
