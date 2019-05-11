import models from '../models';
import Slug from '../helpers/slug';
import Description from '../helpers/makeDescription';

const { article: ArticleModel, user: UserModel, bookmark: bookmarkModel } = models;
/**
 * @description  CRUD for article Class
 */
class Article {
  /**
   *@author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Article
   */
  static async createArticle(req, res) {
    const {
      title, body, taglist, description
    } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title can not be null' });
    } if (!body) {
      return res.status(400).json({ error: 'body can not be null' });
    }
    const authorid = req.user;
    const checkuser = await UserModel.checkuser(authorid);
    if (!checkuser) {
      return res.status(404).json({
        error: 'Please register'
      });
    }
    const slugInstance = new Slug(title);
    const descriptionInstance = new Description(description, body);
    const descriptData = descriptionInstance.makeDescription();
    const slug = slugInstance.returnSlug();
    const newArticle = {
      title, body, description: descriptData, slug, authorid, taglist
    };
    const article = await ArticleModel.createArticle(newArticle);
    return res.status(201).json({ article });
  }

  /**
   *
   * @author Innocent Nkunzi
   * @param {object} req
   * @param {object} res
   * @returns {object} returns an object of one article
   */
  static async getArticle(req, res) {
    const { slug } = req.params;
    const article = await ArticleModel.getOneArticle(slug);
    if (!article) {
      res.status(404).json({
        error: 'No article found with the slug provided'
      });
    } else {
      res.status(200).json({ article });
    }
  }

  /**
  * @author Innocent Nkunzi
  * @param {*} req
  * @param {*} res
  * @returns {object} it returns an object of articles
  */
  static async getAllArticles(req, res) {
    const getAll = await ArticleModel.getAll();
    if (getAll.length === 0) {
      res.status(404).json({
        error: 'Not article found for now'
      });
    } else {
      res.status(200).json({
        article: getAll
      });
    }
  }

  /**
   *@author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Article
   */
  static async deleteArticle(req, res) {
    const { slug } = req.params;
    const authorid = req.user;
    const findArticle = await ArticleModel.findArticleSlug(authorid, slug);
    if (!findArticle) {
      return res.status(404).json({ error: 'No article found for you to delete' });
    }
    const articleId = findArticle.id;
    const deleteArticle = await ArticleModel.deleteArticle(articleId);
    if (deleteArticle.length !== 0) {
      res.status(200).json({
        message: 'Article deleted'
      });
    }
  }

  /**
   * @author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} updted Article
  */
  static async updateArticle(req, res) {
    const { slug } = req.params;
    const {
      title, body, taglist, description
    } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title can not be null' });
    } if (!body) {
      return res.status(400).json({ error: 'body can not be null' });
    }
    const authorid = req.user;
    const searchArticle = await ArticleModel.findArticleSlug(authorid, slug);
    if (!searchArticle) {
      res.status(404).json({
        error: 'No article found for you to edit'
      });
    } else {
      const { id } = searchArticle;
      const slugInstance = new Slug(title);
      const descripInstance = new Description(description, body);
      const descriptData = descripInstance.makeDescription();
      const newSlug = slugInstance.returnSlug();
      const updatedArticle = {
        title, body, description: descriptData, slug: newSlug, authorid, taglist
      };
      const updateArticle = await ArticleModel.updateFoundArticle(id, updatedArticle);
      res.status(200).json({
        message: 'Article updated',
        article: updateArticle
      });
    }
  }

  /**
   *@author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} return a bookmarked article
   */
  static async bookmarkArticle(req, res) {
    const { slug } = req.params;
    const userid = req.user;
    const checkSlug = await ArticleModel.getOneArticle(slug);
    if (!checkSlug) {
      return res.status(404).json({
        error: 'No article found with the specified slug'
      });
    }
    const articleId = checkSlug.id;
    const checkBookmark = await bookmarkModel.checkuser(userid, articleId);
    if (!checkBookmark) {
      const bookmark = await bookmarkModel.bookmark(userid, articleId);
      res.status(201).json({
        message: 'Bookmarked',
        article: bookmark
      });
    } else {
      res.status(403).json({
        error: 'Already bookmarked'
      });
    }
  }

  /**
 *
 * @author Innocent Nkunzi
 * @param {*} req
 * @param {*} res
 * @returns {object} it returns an object of articles
 */
  static async getAllArticlesPagination(req, res) {
    const pageNumber = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    if (pageNumber <= 0) {
      return res.status(403).json({
        error: 'Invalid page number'
      });
    } if (limit <= 0) {
      return res.status(403).json({
        error: 'Invalid page limit'
      });
    }
    const offset = limit * (pageNumber - 1);
    const getAll = await ArticleModel.getAll(limit, offset);
    if (getAll.length) {
      res.status(200).json({
        article: getAll,
        articlesCount: getAll.length
      });
    } else {
      res.status(404).json({
        error: 'No article found for now'
      });
    }
  }
}
export default Article;
