import { get } from 'lodash';

export function isAppOffline(err) {
  return !!(err && err.request && err.request.status === 0);
}

export function getErrMsg(err) {
  if (get(err, 'response.data.message')) {
    return `Une erreur est survenue lors de l'appel au serveur : ${get(err, 'response.data.message')}`;
  }
  if (isAppOffline(err)) {
    return "L'application semble être hors ligne. La connexion avec le serveur n'a pas pu être établie.";
  }
  return err.message ? `Une erreur est survenue : ${err.message}` : 'Une erreur est survenue. Veuillez réactualiser la page.';
}
