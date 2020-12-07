export default {
  user: {
    isLoggedIn: false,
  },
  shoppingList: {},
  store: {},
  products: {
    dbList: [],
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
