const lodash = require('lodash');

const dummy = () => {
    return 1
  }
  
const totalLikes = (blogs) => {
    const summedLikes = blogs.reduce((total, blog) => total + blog.likes, 0);
    return blogs.length === 0 ? 0 : summedLikes;
  }

const favoriteBlog = (blogs) => {
    const mostLiked = blogs.reduce((mostLikedBlog, blog) => {
        if (blog.likes > mostLikedBlog.likes) {
            return blog
        } else {
            return mostLikedBlog
        }
    })
    
    return { 
        title: mostLiked.title,
        author: mostLiked.author,
        likes: mostLiked.likes
    }
}

const activeAuthor = (blogs) => {
    const authorCounts = lodash.countBy(blogs, 'author');
    const mostActiveAuthor = lodash.maxBy(lodash.keys(authorCounts), (author) => authorCounts[author]);
    return {
        author: mostActiveAuthor,
        blogs: authorCounts[mostActiveAuthor]
    }
}

const mostLikes = (blogs) => {
    const authorLikes = lodash.groupBy(blogs, 'author')
    lodash.forEach(authorLikes, (authorBlogs, author) => {
        authorLikes[author] = lodash.sumBy(authorBlogs, 'likes')
    })
    const mostLikedAuthor = lodash.maxBy(lodash.keys(authorLikes), (author) => authorLikes[author])

    return {
        author: mostLikedAuthor,
        likes: authorLikes[mostLikedAuthor]
    }
}


  module.exports = {
    dummy, totalLikes, favoriteBlog, activeAuthor, mostLikes
  }

