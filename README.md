# VidGrid<img src="https://www.spreadshirt.com/image-server/v1/designs/11624206,width=178,height=178/stripper-pole-dancer-silhouette-darr.png" height="30" style="height:30px;">
This Userscript for [Chaturbate](https://chaturbate.com "Chaturbate.com") allows the user to select multiple broadcasts and displays them in a sortable grid. It utilizes IntersectionObserver to prevent all of the streams from playing simultaneously by pausing the streams that scroll out of view and starting them when they're back within the viewport. It uses MutationObserver to maintain functionality across REACT's room list updates. VidGrid obtains the streams throught the affiliate api, and displays them through VideoJS Player. VidGrid stores the user's selection in the VidGrid object and out of the user's history. 

## Issues
- It probably would be nice if scrolling a player out of the viewport didn't pause Picture-in-Picture, huh? That thoroughly defeats the purpose.
- It wouldn't hurt to put in a button to clear the user's selection, despite doing this automatically as broadcasters become unavailable.

