module.exports = function(eleventyConfig) {

  // Passthrough for assets (CSS, JS)
  eleventyConfig.addPassthroughCopy("src/assets");

  // Add global data for base URL
  eleventyConfig.addGlobalData("baseUrl", process.env.ELEVENTY_ENV === "production" ? "/climate-food-guide/" : "/");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
