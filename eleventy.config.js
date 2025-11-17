module.exports = function(eleventyConfig) {
  console.log("✅ Eleventy config loaded!");
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
