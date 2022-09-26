const { messageBuilder } = getApp()._options.globalData

Page({
  state: {},
  build() {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 50 / 2,
      y: px(260),
      w: px(400),
      h: px(100),
      text_size: px(36),
      radius: px(12),
      normal_color: 0xff0000,
      press_color: 0xaa0000,
      text: 'Fetch Data',
      click_func: (button_widget) => {
        console.log('click button')

        messageBuilder
          .request({
            method: 'GET_STOPS',
          })
          .then((data) => {
            console.log('receive data')

            hmUI.createWidget(hmUI.widget.TEXT, {
              x: px(96),
              y: px(100),
              w: px(288),
              h: px(46),
              color: 0xffffff,
              text_size: px(36),
              align_h: hmUI.align.CENTER_H,
              align_v: hmUI.align.CENTER_V,
              text_style: hmUI.text_style.NONE,
              text: JSON.stringify(data),
            })
          })
      },
    })
  },
})
