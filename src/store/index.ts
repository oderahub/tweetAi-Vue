import { createStore } from 'vuex'

// Define the types for Autobot, Post, and Comment
interface Autobot {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  body: string;
  autobot: Autobot;
}

interface Comment {
  id: string;
  text: string;
  post: Post;
}

// Define the state types
interface State {
  autobots: Autobot[];
  posts: Post[];
  comments: Comment[];
}

// Create the Vuex store
export default createStore({
  state: (): State => ({
    autobots: [], // Array to hold autobots data
    posts: [], // Array to hold posts data
    comments: [] // Array to hold comments data
  }),
  getters: {
    // Getter to retrieve autobots
    getAutobots: (state): Autobot[] => state.autobots,
    // Getter to retrieve posts
    getPosts: (state): Post[] => state.posts,
    // Getter to retrieve comments
    getComments: (state): Comment[] => state.comments,
    // Example: Getter to get the count of autobots
    autobotCount: (state): number => state.autobots.length
  },
  mutations: {
    // Mutation to set autobots
    setAutobots (state: State, autobots: Autobot[]) {
      state.autobots = autobots
    },
    // Mutation to set posts
    setPosts (state: State, posts: Post[]) {
      state.posts = posts
    },
    // Mutation to set comments
    setComments (state: State, comments: Comment[]) {
      state.comments = comments
    }
  },
  actions: {
    // Action to fetch autobots from the API and commit to state
    async fetchAutobots ({ commit }) {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/autobots`)
        const data: Autobot[] = await response.json()
        commit('setAutobots', data)
      } catch (error) {
        console.error('Error fetching Autobots:', error)
      }
    },
    // Action to fetch posts from the API and commit to state
    async fetchPosts ({ commit }, autobotId: string) {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/autobot/${autobotId}/posts`)
        const data: Post[] = await response.json()
        commit('setPosts', data)
      } catch (error) {
        console.error('Error fetching Posts:', error)
      }
    },
    // Action to fetch comments from the API and commit to state
    async fetchComments ({ commit }, postId: string) {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/post/${postId}/comments`)
        const data: Comment[] = await response.json()
        commit('setComments', data)
      } catch (error) {
        console.error('Error fetching Comments:', error)
      }
    }
  },
  modules: {
    // Define any modules if needed
  }
})
