# Character Tracker

Originally built for a dnd campaign, this app can be used to keep track of characters and monsters during a session. Spectator mode is designed to run on a screen that every player can see. Each session is represented by a "room" which players can join. All character and monster data updates in real time. The room owner can assign control of characters or monsters to any player present in the room. **This app is in a beta state, expect bugs 😁**

## Running

```
git clone https://github.com/calebhiebert/ctrack
```

This app is built with Docker, so one command is all it takes.

```
docker-compose up
```

The app should be up and running at http://localhost:8080

## Tech Used

- [Vue.js](https://vuejs.org/)
- [GraphQL](https://graphql.org)
- [Redis](https://redis.io/)
- [Spectre.css](https://picturepan2.github.io/spectre/)
- [Apollo](https://www.apollographql.com/)

## Screenshots

![screenshot](https://i.imgur.com/Y4cv6Hm.png)
![screenshot](https://imgur.com/6RnNxDM.png)
