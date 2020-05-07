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
    errorMsg: '',
  },
  apiCallsInProgress: {
    apiCalls: 0,
    fetchUserCallInProgress: true,
  },
};
