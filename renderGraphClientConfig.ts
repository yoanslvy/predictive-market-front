const fs = require('fs')
const mustache = require('mustache')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Define the data object with the value from the environment variable
const data = {
  endpointContextConditional: `'{context.chainName:${process.env['GRAPH_CONDITIONAL']!}}'`,
}

// Load the Mustache template
const template = fs.readFileSync('.graphclientrc.template.yml', 'utf8')

// Render the template with the data object
const output = mustache.render(template, data)

// Save the rendered YAML to the .graphclientrc.yml file
fs.writeFileSync('.graphclientrc.yml', output, 'utf8')

console.log('.graphclientrc.yml file rendered and saved.')
