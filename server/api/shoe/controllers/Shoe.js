'use strict';

/**
 * Shoe.js controller
 *
 * @description: A set of functions called "actions" for managing `Shoe`.
 */

module.exports = {

  /**
   * Retrieve shoe records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.shoe.search(ctx.query);
    } else {
      return strapi.services.shoe.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a shoe record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.shoe.fetch(ctx.params);
  },

  /**
   * Count shoe records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.shoe.count(ctx.query);
  },

  /**
   * Create a/an shoe record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.shoe.add(ctx.request.body);
  },

  /**
   * Update a/an shoe record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.shoe.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an shoe record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.shoe.remove(ctx.params);
  }
};
