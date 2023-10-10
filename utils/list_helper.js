
const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    const summedLikes = blogs.reduce((total, blog) => total + blog.likes, 0);
    return blogs.length === 0 ? 0 : summedLikes;
  }

  module.exports = {
    dummy, totalLikes
  }