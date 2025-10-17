import React from "react";
import PostList from "../components/PostList";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left rail */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-2xl mx-auto p-4">
          <PostList />
        </div>
      </main>
    </div>
  );
};

export default Home;
