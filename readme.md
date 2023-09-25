# BNN Pong Server

The BNN Pong Server acts as a public interface where users can queue to play pong against a biological neural network (BNN). The BNN can be integrated with [GCOS](https://github.com/GeneralCybernetics/GCOS), which can be linked to one of the endpoints of the BNN Pong Server, allowing for real-time interaction between users and the BNN.

## Completed Features:
- Physics for Ball & Paddles (client/index.js)
- client-side Pong (to test, use live server to open client/index.html)
- Distribution & Socket Setup (server/index.js & server/server.js)
- Rendering for both Clients & Server

## Ongoing Developments:
- Smoothing the implementation of the mechanics of client/index.js between server/server.js and server/index.js
- A bidirectional socket for transmitting relevant info to & from the BNN
- BNN Spike Visualization (Three.js)
- A queueing mechanism allowing users to line up and play against the BNN

## Known Bugs:
- Ball accelerates when accessed from multiple servers (server/index.js & server/server.js)
- Rarely, if the ball hits y-axis endpoints of the paddle, the ball displace vertically before the bounce off
