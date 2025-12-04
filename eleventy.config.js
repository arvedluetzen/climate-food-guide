const nunjucks = require("nunjucks");

module.exports = function(eleventyConfig) {

  // Passthrough for assets (CSS, JS)
  eleventyConfig.addPassthroughCopy("src/assets");

  // Add global data for base URL
  eleventyConfig.addGlobalData("baseUrl", process.env.ELEVENTY_ENV === "production" ? "/climate-food-guide/" : "/");

  // Add a Nunjucks filter to process content with variables
  eleventyConfig.addNunjucksFilter("processVars", function(content, data) {
    const env = nunjucks.configure({ autoescape: false });
    return nunjucks.renderString(content, data);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
