const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isTextList = (v) => Array.isArray(v) && v.length > 0 && v.every(isText);

module.exports = (req, res, next) => {
  const { name, cuisine, difficulty, ingredients, instructions } = req.body ?? {};

  if (!isText(name)) return res.status(400).json({ message: 'Recipe name is required' });
  if (!isText(cuisine)) return res.status(400).json({ message: 'Cuisine is required' });
  if (!DIFFICULTIES.includes(difficulty))
    return res.status(400).json({ message: 'Difficulty must be Easy, Medium or Hard' });
  if (!isTextList(ingredients))
    return res.status(400).json({ message: 'Ingredients must be a non-empty list of text' });
  if (!isTextList(instructions))
    return res.status(400).json({ message: 'Instructions must be a non-empty list of text' });

  next();
};