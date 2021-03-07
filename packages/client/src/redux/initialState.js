export default {
  user: {
    isLoggedIn: false,
  },
  shoppingList: null,
  store: null,
  products: {
    dbList: undefined,
    userList: undefined,
  },
  error: {
    errorMsg: '',
  },
  apiCallsInProgress: {
    apiCalls: 0,
    fetchUserCallInProgress: true,
  },
};
