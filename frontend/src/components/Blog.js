import React, { useState } from 'react';
import BlogService from '../services/BlogService';

const Blog = ({ blog, setBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    try {
      const response = await BlogService.update(blog.id, updatedBlog);
      setBlog(response);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };
  
  return (
    <div className="SingleBlog">
      {showDetails ? (
        <div>
          <div>
            {blog.title} {blog.author} <button onClick={() => setShowDetails(false)}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          <button>remove</button>
        </div>
      ) : (
        <div>
          <div>
            {blog.title} {blog.author} <button onClick={() => setShowDetails(true)}>view</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;