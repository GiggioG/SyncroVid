# SyncroVid
Watch videos simultanously with your friends
## Instalation
1. Use the command `git clone https://github.com/GiggioG/SyncroVid.git`.
2. Use the command `cd SyncroVid`.
3. Use the command `npm i`.
## Use
### Starting the server
Use the command `startServer.bat` to start the server without hosting a video.

Use the command `startServer.bat <VIDEOPATH>` to start the server and serve the video in `<VIDEOPATH>` to `/video`. *\<VIDEOPATH> MUST BE A PATH TO A MP4*
If your friends are on a different network, you will need to `port forward` ports `8080 and 3000` on your router to `8080 and 3000` on your machine. You see how to do that [here](https://www.noip.com/support/knowledgebase/general-port-forwarding-guide/).
### Watching videos
If your friends are on your network, get your ip by doing the command `ipconfig | findstr "IPv4 Address." | findstr /V "Autoconfiguration"`.

If your friedns aren't on your network, get your ip by visiting `https://www.google.com/search?q=what+is+my+ip`.

Next, open `http://<yourip>:8080/master` and tell your friends to open `http://<yourip>:8080`.

Then, when everyone gets in, press the `Refresh` button, this will refresh all of your friend's pages.

After that, write the url to the video (*must be a url to an mp4*) in the `video url` text field and press `Source`. If you hosted a video, then type `/video` as your video url.

This should load the video for you and for your friends.

Then, when you play the video, this will play it for your friends, too. Same with stopping and seeking. If you want to seek to sertain minutes and seconds, put the minutes in the `min` field, the seconds in the `sec` field and press `Seek`.