import {
  _init,
  _createUser,
  _logoutUser,
  _loginUser,
  _publishVideo,
  _getMyVideos,
  _removeVideo,
  _getServerTime,
  _getNearVideos,
  _getMyInfo,
  _saveMyInfo,
} from "./parse-server";

export function init() {
  _init();
}

export async function createUser(name, email, password) {
  return await _createUser(name, email, password);
}

export async function loginUser(name, password) {
  return await _loginUser(name, password);
}

export async function logoutUser() {
  return await _logoutUser();
}

export async function publishVideo(video, thumbnail, data, callback) {
  return await _publishVideo(video, thumbnail, data, callback);
}

export async function getMyVideos() {
  return await _getMyVideos();
}

export async function removeVideo(id) {
  return await _removeVideo(id);
}

export async function getServerTime() {
  return await _getServerTime();
}

export async function getNearVideos(location, radius, onlyFirends) {
  return await _getNearVideos(location, radius, onlyFirends);
}

export async function getMyInfo() {
  return await _getMyInfo();
}

export async function saveMyInfo(data) {
  return await _saveMyInfo();
}
