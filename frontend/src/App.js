import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/Blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const loadUserToken = () => {
    const storedUser = window.localStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  };

  useEffect(() => {
    loadUserToken();

    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
    console.log('logging in with', username, password)
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

    } catch {
  }
}

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  const handleNewBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    try {
      const response = await blogService.create(newBlog);

      setTitle('');
      setAuthor('');
      setUrl('');

      setBlogs([...blogs, response]);
    } catch (error) {
      console.error('Error creating a new blog:', error);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <> {user.name} logged in </>
      <button style={{ marginBottom: "20px" }} onClick={handleLogout}>
        Logout
      </button>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App