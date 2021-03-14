export default {
  user: {
    isLoggedIn: false,
  },
  shoppingList: null,
  store: null,
  products: {
    dbList: null,
    userList: null,
  },
  error: {
    errorMsg: '',
  },
  apiCallsInProgress: {
    apiCalls: 0,
    fetchUserCallInProgress: true,
  },
};
