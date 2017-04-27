# wdi-project-2

//  - use for presentation?

Brief for the project: ...

# How the project came about and how it works

I love podcasts. I love listening to them, and I even tried making one with a friend for a while. I listen to them when I'm going to bed, I listen to them when I go for a run, but most of all I listen to them when I'm on the tube. The problem with that - I would always end up with little bits and pieces of episodes that I didn't have time for while I was travelling, or I would finish my episode only halfway to my destination: the podcast length never matched the journey.

And so PodMe was born - the web app that finds episodes of popular podcasts and matches them to your journey by duration. The user can register, log in and search podcasts all from the homepage.

After logging in the search function is enable, the user enters a start point and a destination (or chooses a pre-saved journey combination), then selects a topic (and subtopic if they wish) and clicks search. PodMe will then find the top podcasts in that genre and for each podcast return the 10 episodes that most closely match the duration of your journey (calculated by Google Maps)... Happy listening!

# Further features to add with more time

As this project represents just a week's work I was not able to implement all of the features that I would have liked to given more time.

Top of my list of additions would be an embedded Google Map that could be used to select start and end points for the user's journey. Alongside that, in order to further improve the flexibility of the search engine I would allow users to save specific locations rather than just the origin/destination combinations that are currently available. A further feature along these lines would be the reimplementation of a classic search box for selecting podcast topics - this was in my original MVP build of the app, but led to too many null responses from the iTunes search API (additionally part of the fun I had with this project was discovering new podcasts that I never would have found otherwise: Read 'n Code - a Podcast about literature and coding being a prime example. Who doesn't want to listen to 25 minutes on "Camus' The Plague and Erlang"..?).

Outside of the search functionality, I would like to refine the styling and develop the user account pages. Having a publicly viewable profile and ability to share/save specific podcasts (or even journey-podcast combinations) would be a first step towards this.

# How it works - code explanation...



# Challenges faced

This project was tough, I spent a significant chunk of the week wrestling with the highly variable formats that different podcasts use for their RSS feeds and the countless 'undefined' responses that this led to.

 - Initial findClosest function vs eventual sort function.
 - Stages of search: early build which returned 10 closest duration episodes from combined array of all episodes.

# Biggest wins

Error handling: the aforementioned variety in the podcast feeds required a lot of error handling and use of try - catch when sourcing the data. Reaching a point where the search can deal with undefined and null results and still return the episodes that it does find was a huge win.

Additionally, I was happy with the styling - I was keen to keep the app very minimal on the front end and I think I achieved this, with a simple views structure and the ability to register, log in and search all on the same page.

# Packages used

- jQuery
- Express
- Node
- Mongo
- mongoose
- Google Maps API
- iTunes store search API
