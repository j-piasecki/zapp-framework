import { gettext as getText } from 'i18n'

AppSettingsPage({
  build(props) {
    const stops = props.settingsStorage.getItem('stops') ? JSON.parse(props.settingsStorage.getItem('stops')) : []

    // dunnow why but adding another view makes `width: '100%'` work on TextInput
    const addBTN = View(
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        },
      },
      [
        View(
          {
            style: {
              fontSize: '16px',
              lineHeight: '30px',
              borderRadius: '30px',
              background: '#650033',
              color: 'white',
              padding: '0 15px',
              width: '100%',
              height: '48px',
            },
          },
          [
            TextInput({
              label: getText('addStop'),
              labelStyle: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '48px',
              },
              onChange: (val) => {
                stops.push({ name: val })

                props.settingsStorage.setItem('stops', JSON.stringify(stops))
              },
            }),
          ]
        ),
      ]
    )

    const stopViews = []

    stops.forEach((item, index) => {
      stopViews.push(
        View(
          {
            style: {
              borderBottom: '1px solid #e3bdc6',
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
                      item.name = val.trim()
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
                background: '#93000a',
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
                border: '1px solid #ffd9e2',
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
