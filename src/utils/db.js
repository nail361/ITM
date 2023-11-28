import {
  _init,
  _createUser,
  _logoutUser,
  _loginUser,
  _publishVideo,
  _getUserVideos,
  _removeVideo,
  _getServerTime,
  _getNearVideos,
  _getUserInfo,
  _saveMyInfo,
  _getUsersInfo,
  _getFollowing,
  _getFollowers,
  _searchUsers,
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

export async function getUserVideos(uid) {
  return await _getUserVideos(uid);
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

export async function getUserInfo(uid) {
  return await _getUserInfo(uid);
}

export async function saveMyInfo(data) {
  return await _saveMyInfo();
}

export async function getUsersInfo(uids, data) {
  return await _getUsersInfo(uids, data);
}

export async function getFollowing(uid) {
  return await _getFollowing(uid);
}

export async function getFollowers(uid) {
  return await _getFollowers(uid);
}

export async function searchUsers(searchText) {
  return await _searchUsers(searchText);
}
