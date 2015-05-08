module.exports = (env, callback) ->
    class BlogpostPage extends env.plugins.MarkdownPage
      # Set default template
      getTemplate: ->
        @metadata.template or env.config.blog.template or super()

      # Set default filename template
      getFilenameTemplate: ->
        @metadata.filenameTemplate or env.config.blog.filenameTemplate or super()

    # Register the plugin
    prefix = if env.config.blog.postsDir then env.config.blog.postsDir + '/' else ''
    env.registerContentPlugin 'posts', prefix + '**/*.*(markdown|mkd|md)', BlogpostPage
    callback()