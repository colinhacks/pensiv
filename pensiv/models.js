/*
Models for Pensiv:

	Hashtags: just the string 				{hashtag:"todo"}
	Thought: text, contained hashtags  		{user:user_id,text:"Text goes here",hashtags=[this, that]}
	Users: hashtags used, sivs posted		

*/


Hashtags = new Meteor.Collection("hashtags");
Thoughts = new Meteor.Collection("thoughts");
