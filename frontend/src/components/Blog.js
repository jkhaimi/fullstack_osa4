import React, { useState } from 'react';
import BlogService from '../services/BlogService';
import PropTypes from 'prop-types';

const Blog = ({ blog, setBlog, handleRemoveBlog }) => {
  Blog.propTypes = {
    blog: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      author: PropTypes.string,
      url: PropTypes.string,
      likes: PropTypes.number,
      user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
    setBlog: PropTypes.func,
    handleRemoveBlog: PropTypes.func,
  };
  
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

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        handleRemoveBlog(blog.id);
        await BlogService.remove(blog.id);
      } catch (error) {
        console.error('Error removing blog:', error);
      }
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
          <button onClick={handleRemove}>remove</button>
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