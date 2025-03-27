import { createContext, useContext, useState } from "react";

import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1) Create Context
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    // 2) Provide value to Child Components
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        searchQuery,
        setSearchQuery,
        handleAddPost,
        handleClearPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

function usePost() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("PostContext was used outside of the PostProvider");
  }

  return context;
} 

export { PostProvider, usePost };
