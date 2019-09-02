module.exports.questionPromptFactory = (rl) => (q) => {
  return new Promise((res) => {
      rl.question(q, res);
  });
};
