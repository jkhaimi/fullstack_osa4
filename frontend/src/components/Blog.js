import React, { useState } from 'react';

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="SingleBlog">
      {showDetails ? (
        <div>
          <div>
          {blog.title} {blog.author} <button onClick={() => setShowDetails(false)}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button>like</button></div>
          <div>{blog.user.name}</div>
        </div>
      ) : (
        <div>
          <div>{blog.title} {blog.author} <button onClick={() => setShowDetails(true)}>view</button></div>

        </div>
      )}
    </div>
  );
};

export default Blog;
