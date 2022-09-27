import { gettext } from 'i18n'

AppSettingsPage({
  build(props) {
    const stops = props.settingsStorage.getItem('stops') ? JSON.parse(props.settingsStorage.getItem('stops')) : []

    const addBTN = View(
      {
        style: {
          fontSize: '12px',
          lineHeight: '30px',
          borderRadius: '30px',
          background: '#409EFF',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 15px',
          width: '100%',
        },
      },
      [
        TextInput({
          label: 'Add new stop',
          onChange: (val) => {
            stops.push({ name: val })

            props.settingsStorage.setItem('stops', JSON.stringify(stops))
          },
        }),
      ]
    )

    const stopViews = []

    stops.forEach((item, index) => {
      stopViews.push(
        View(
          {
            style: {
              borderBottom: '1px solid #eaeaea',
              padding: '6px 0',
              marginBottom: '6px',
              display: 'flex',
              flexDirection: 'row',
            },
          },
          [
            View(
              {
                style: {
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  justfyContent: 'center',
                  alignItems: 'center',
                },
              },
              [
                TextInput({
                  bold: true,
                  value: item.name,
                  subStyle: {
                    color: '#333',
                    fontSize: '14px',
                  },
                  maxLength: 200,
                  onChange: (val) => {
                    if (val.length > 0 && val.length <= 200) {
                      item.name = val
                      item.id = undefined
                      props.settingsStorage.setItem('stops', JSON.stringify(stops))
                    }
                  },
                }),
              ]
            ),
            Button({
              label: '✖',
              style: {
                fontSize: '16px',
                borderRadius: '30px',
                background: '#D85E33',
                color: 'white',
              },
              onClick: () => {
                stops.splice(index, 1)
                props.settingsStorage.setItem('stops', JSON.stringify(stops))
              },
            }),
          ]
        )
      )
    })

    return View(
      {
        style: {
          padding: '12px 20px',
        },
      },
      [
        addBTN,
        stopViews.length > 0 &&
          View(
            {
              style: {
                marginTop: '12px',
                padding: '10px',
                border: '1px solid #eaeaea',
                borderRadius: '6px',
                backgroundColor: 'white',
              },
            },
            [...stopViews]
          ),
      ]
    )
  },
})
