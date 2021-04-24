const path = require('path');

module.exports = {
  siteMetadata: {
    siteTitle: 'Thoughts on code and people',
    siteDescription: 'Thoughts on code and people | Manos Liakos',
    siteImage: '/banner.png', // main image of the site for metadata
    siteUrl: 'https://blog.manos-liakos.dev',
    pathPrefix: `/`,
    siteLanguage: 'en',
    ogLanguage: `en_US`,
    author: 'Emmanouil Liakos', // for example - 'Ivan Ganev'
    authorDescription: 'Software Engineer', // short text about the author
    avatar: '/avatar.webp',
    twitterSite: '', // website account on twitter
    twitterCreator: '', // creator account on twitter
    social: [
      {
        icon: `envelope`,
        url: `mailto:mail@manos-liakos.dev`
      },
      {
        icon: `linkedin`,
        url: `https://www.linkedin.com/in/manos-liakos/`
      },
      {
        icon: `github`,
        url: `https://github.com/mliakos`
      },
      {
        icon: `at`,
        url: `https://manos-liakos.dev/`
      },
      {
        icon: `dev`,
        url: `https://dev.to/mliakos/`
      }
    ]
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(__dirname, `static`, `media`),
        name: 'media'
      }
    },
    {
      resolve: 'gatsby-theme-chronoblog',
      options: {
        uiText: {
          // ui text fot translate
          feedShowMoreButton: 'show more',
          feedSearchPlaceholder: 'search',
          cardReadMoreButton: 'read more →',
          allTagsButton: 'all tags'
        },
        feedItems: {
          // global settings for feed items
          limit: 50,
          yearSeparator: true,
          yearSeparatorSkipFirst: true,
          contentTypes: {
            links: {
              beforeTitle: '🔗 '
            }
          }
        },
        feedSearch: {
          symbol: '🔍'
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Thoughts on code and people`,
        short_name: `Thoughts on code and people`,
        start_url: `https://manos-liakos.dev/`,
        background_color: `#fff`,
        theme_color: `#3a5f7d`,
        display: `standalone`,
        icon: `src/assets/favicon.png`
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // replace "UA-XXXXXXXXX-X" with your own Tracking ID
        trackingIds: ['G-2PG4GD6KM0']
      }
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        // replace "chronoblog-any" with your own disqus shortname
        shortname: `chronoblog-any`
      }
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        publicPath: `admin`,
        modulePath: path.join(__dirname, `src`, `netlifycms`, 'cms.js')
      }
    },
    'gatsby-plugin-netlify' // make sure to keep it last in the array
  ]
};
