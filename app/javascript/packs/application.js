import turbolinks from 'turbolinks'
import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"
import '../channels'

turbolinks.start()

const application = Application.start()
const context = require.context("./controllers", true, /\.js$/)
application.load(definitionsFromContext(context))
