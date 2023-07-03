const axios = require('axios')
const menuController = {
  getMenuMain: (req, res, next) => {
    try {
      return res.redirect('/menu/classic')
    } catch (err) { next(err) }
  },
  getMenuPreference: async (req, res, next) => {
    try {
      let tags
      const preference = req.params.preference
      if (preference === 'classic') {
        tags = ''
      } else {
        tags = preference
      }
      const recipes = await axios({
        method: 'get',
        url: 'https://api.spoonacular.com/recipes/random',
        headers: { 'Content-Type': 'application/json' },
        params: {
          limitLicense: true,
          number: 50,
          tags,
          apiKey: process.env.API_KEY
        }
      })
      const recipesData = recipes.data.recipes.map(recipe => ({
        id: recipe.id,
        dishName: recipe.title,
        vegetarian: recipe.vegetarian,
        glutenFree: recipe.glutenFree,
        dairyFree: recipe.dairyFree,
        cookingTime: recipe.readyInMinutes,
        servings: recipe.servings,
        image: recipe.image || 'https://images.unsplash.com/photo-1633878353697-f751870d1d76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        instruction: Object.assign({}, recipe.analyzedInstructions[0]?.steps.map(s => s.step) || ['Instructions are currently unavailable, please check the full recipe below for more details.']),
        ingredient: Object.assign({}, recipe.extendedIngredients?.map(i => i.original) || ['Ingredients are currently unavailable, please check the full recipe below for more details.']),
        fullDetailsUrl: recipe.spoonacularSourceUrl || '/menu'
      }))
      res.render('menu', {
        recipesData,
        path: `/menu/${preference}`
      })
    } catch (err) {
      req.flash('warning_msg', 'Could not find the menu!')
      res.render('menu')
      return next(err)
    }
  }
}

module.exports = menuController
