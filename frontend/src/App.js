import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/Blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import CreateBlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [blogFormVisible, setBlogFormVisible] = useState(false);

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
    event.preventDefault();
    try {
      console.log('logging in with', username, password);
      const user = await loginService.login({
        username,
        password,
      });
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

      setSuccessMessage('Logged in successfully');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch {
      setErrorMessage('Wrong username or password');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
    setSuccessMessage('Logged out successfully');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
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
      setBlogFormVisible(false)

      console.log('Added a new blog');
      setSuccessMessage(`Added a new blog ${newBlog.title} by ${newBlog.author}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error creating a new blog:', error);
      setErrorMessage('Failed to add a new blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification errorMessage={errorMessage} successMessage={successMessage} />
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
      <Notification errorMessage={errorMessage} successMessage={successMessage} />
      <> {user && `${user.name} logged in`} </>
      <button style={{ marginBottom: '20px' }} onClick={handleLogout}>
        Logout
      </button>
      <br></br>
      <button style={{marginBottom: '20px'}} onClick={() => setBlogFormVisible(true)}>New blog</button>
      {blogFormVisible && (
        <div>
          <CreateBlogForm
            handleNewBlog={handleNewBlog}
            setTitle={setTitle}
            setAuthor={setAuthor}
            setUrl={setUrl}
            title={title}
            author={author}
            url={url}
          />
          <button
            style={{ marginBottom: '20px' }}
            onClick={() => setBlogFormVisible(false)}
          >
            cancel
          </button>
        </div>
      )}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
