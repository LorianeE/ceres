export function isAppOffline(err) {
  return !!(err && err.request && err.request.status === 0);
}

export function getErrMsg(err) {
  // The request was made and the server responded with a status code
  // that falls out of the range of 2xx
  if (err.response) {
    return "Une erreur est survenue lors de l'appel au serveur. Veuillez réactualiser la page.";
  }
  if (isAppOffline(err)) {
    return "Oh non ! L'application semble être hors ligne...";
  }
  return 'Une erreur est survenue. Veuillez réactualiser la page.';
}
