module.exports = (grunt) ->
	grunt.loadNpmTasks 'grunt-zip'

	grunt.registerTask 'default', []
	grunt.registerTask 'dist', ['zip:dist']

	grunt.initConfig
		zip:
			dist:
				dest: 'dist.zip'
				src: [
					'manifest.json'
					'images/*.png'
					'options-page/*'
					'popup-page/*'
					'scripts/*'
					'vendor/**/*'
				]
