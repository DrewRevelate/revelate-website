/**
 * Express EJS Layouts Middleware
 * Provides basic layout functionality for EJS templates
 */

module.exports = function() {
  return function(req, res, next) {
    // Original render function
    const originalRender = res.render;
    
    // Add contentFor function to the locals
    res.locals.contentFor = function(contentName) {
      return function(content) {
        if (!res.locals[contentName]) {
          res.locals[contentName] = '';
        }
        res.locals[contentName] += content;
      };
    };
    
    // Override render function
    res.render = function(view, options, callback) {
      const layoutFile = (options && options.layout) || 'layouts/main';
      const disableLayout = options && options.layout === false;
      
      // Handle function callback
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      
      // Ensure options is an object
      options = options || {};
      
      // Set layout option to false to avoid endless recursion
      const renderOptions = Object.assign({}, options, { layout: false });
      
      if (disableLayout) {
        return originalRender.call(this, view, renderOptions, callback);
      }
      
      // Render the view first
      originalRender.call(this, view, renderOptions, (err, content) => {
        if (err) {
          return callback ? callback(err) : next(err);
        }
        
        // Set the rendered content as body in locals
        renderOptions.body = content;
        
        // Render the layout with the view content
        originalRender.call(this, layoutFile, renderOptions, callback);
      });
    };
    
    next();
  };
};