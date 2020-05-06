export default {
  user: {
    isLoggedIn: false,
  },
  shoppingList: {},
  products: {
    dbList: [],
    userList: [],
  },
  error: {
    errMsg: '',
  },
  apiCallsInProgress: {
    apiCalls: 0,
    fetchUserCallInProgress: false,
  },
};
