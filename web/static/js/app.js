/* eslint-disable react/jsx-filename-extension */

import React from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"

import RemoteRetro from "./components/remote_retro"
import RetroChannel from "./services/retro_channel"
import rootReducer from "./reducers"

const userToken = window.userToken

const retroChannelConfiguration = { userToken, retroUUID: window.retroUUID }
const retroChannel = RetroChannel.configure(retroChannelConfiguration)

const webrtc = new SimpleWebRTC({
  // the id/element dom element that will hold "our" video
  // the id/element dom element that will hold remote videos
  localVideoEl: `${userToken}-video`,
  remoteVideosEl: "remoteVideos",
  // immediately ask for camera access
  autoRequestMedia: true,
  nick: userToken,
})

webrtc.on('readyToCall', () => {
  webrtc.joinRoom(window.retroUUID)
})

webrtc.on("peerStreamAdded", (peer) => {
  debugger
  console.log('awwwwww yeah')
})
const reactRoot = document.querySelector(".react-root")

render(
  <Provider store={createStore(rootReducer)}>
    <RemoteRetro retroChannel={retroChannel} userToken={userToken} />
  </Provider>,
  reactRoot
)
