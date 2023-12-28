import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  // userProfile: null,
  // token: null,
  // posts: [],
  // friends: [],
  // chatMessages: {},
  // unseenChatMessages: false,
  // notifications: [],
  // unseenNotifications: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // setUserProfile: (state, action) => {
    //   state.userProfile = action.payload;
    // // },
    // // setLogout: (state) => {
    // //   Object.assign(state, { ...initialState, mode: state.mode });
    // // },
    // // setFriends: (state, action) => {
    // //   if (state.friends) {
    // //     state.friends = action.payload.friends;
    // //   }
    // // },
    // // setPosts: (state, action) => {
    // //   state.posts = action.payload.posts;
    // // },
    // // setPost: (state, action) => {
    // //   const updatedPosts = state.posts.map((post) => {
    // //     if (post._id === action.payload.post._id) return action.payload.post;
    // //     return post;
    // //   });
    // //   state.posts = updatedPosts;
    // // },
    // // setMessages: (state, action) => {
    // //   state.chatMessages = action.payload.chatMessages;
    // // },
    // // setUnseenChatMessages: (state, action) => {
    // //   state.unseenChatMessages = action.payload.areUnseenChatMessages;
    // // }
  },
});

export const {
  setUser,
  // setLogout,
  // setFriends,
  // setPosts,
  // setPost,
  // setUserProfile,
  // setMessages,
  // setUnseenChatMessages,
  // setUnseenNotifications,
  // setNotifications,
} = authSlice.actions;

export default authSlice.reducer;
