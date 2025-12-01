module.exports = function(eleventyConfig) {

  // Passthrough for assets (CSS, JS)
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
