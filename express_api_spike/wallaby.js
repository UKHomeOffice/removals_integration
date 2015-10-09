module.exports = () => {
  return {
    files: [
      // 'style/calculator.css',
      // {pattern: 'lib/jquery.js', instrument: false},
      'public/javascripts/*.js',
      //'routes/*.js'
      // 'test/helper/template.js'
    ],
    tests: [
      'test/*Spec.js'
    ],
    debug: true
  };
};
