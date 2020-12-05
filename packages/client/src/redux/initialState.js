export default {
  user: {
    isLoggedIn: false,
  },
  shoppingList: {},
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
