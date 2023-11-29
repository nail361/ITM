export function calculatePopularity(likes, dislikes, followers) {
  const likesPercent =
    Math.round(((likes - dislikes) / (likes + dislikes)) * 100) || 0;

  const likesReducer = likesPercent / 2;
  const sign = Math.sign(likes - dislikes);
  const popularity = likesReducer + (followers / 100000) * sign;
  const popularityClaim = Math.max(Math.min(popularity, 100), -100);

  return popularityClaim;
}
