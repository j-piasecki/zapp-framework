/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually

  tutorialSidebar: [
    'introduction',
    'installation',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/zapp',
        'api/application',
        'api/config',
        'api/navigator',
        'api/color',
        {
          type: 'category',
          label: 'Layout',
          items: [
            'api/layout/simplescreen',
            'api/layout/stack',
            'api/layout/row',
            'api/layout/column',
          ],
        },
        {
          type: 'category',
          label: 'Effects',
          items: [
            'api/effect/remember',
            'api/effect/rememberimmutable',
            'api/effect/rememberobservable',
            'api/effect/rememberlauncherforresult',
            'api/effect/sideeffect',
            'api/effect/registercrowneventhandler',
            'api/effect/registergestureeventhandler',
            'api/effect/registerhomebuttoneventhandler',
            'api/effect/registershortcutbuttoneventhandler',
          ],
        },
        {
          type: 'category',
          label: 'Views',
          items: ['api/view/arc', 'api/view/baretext', 'api/view/image'],
        },
        {
          type: 'category',
          label: 'Animations',
          items: ['api/animation/easing', 'api/animation/withtiming', 'api/animation/withrepeat'],
        },
        {
          type: 'category',
          label: 'UI components',
          items: [
            'api/ui/theme',
            'api/ui/activityindicator',
            'api/ui/button',
            'api/ui/checkbox',
            'api/ui/button',
            'api/ui/divider',
            'api/ui/pageindicator',
            'api/ui/radiogroup',
            'api/ui/switch',
            'api/ui/text',
          ],
        },
        {
          type: 'category',
          label: 'Watch specific',
          items: [
            'api/watch/scrollablescreen',
            'api/watch/screenpager',
            'api/watch/remembersavable',
          ],
        },
        {
          type: 'category',
          label: 'Web specific',
          items: ['api/web/registernavigationroutes'],
        },
      ],
    },
  ],
}

module.exports = sidebars
