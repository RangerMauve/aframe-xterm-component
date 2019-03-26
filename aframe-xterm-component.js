let terminalInstance = 0

const TERMINAL_THEME = {
  'theme_foreground': {
    'default': '#ffffff'
  },
  'theme_background': {
    'default': '#000'
  },
  'theme_cursor': {
    'default': '#ffffff'
  },
  'theme_selection': {
    'default': 'rgba(255, 255, 255, 0.3)'
  },
  'theme_black': {
    'default': '#000000'
  },
  'theme_red': {
    'default': '#e06c75'
  },
  'theme_brightRed': {
    'default': '#e06c75'
  },
  'theme_green': {
    'default': '#A4EFA1'
  },
  'theme_brightGreen': {
    'default': '#A4EFA1'
  },
  'theme_brightYellow': {
    'default': '#EDDC96'
  },
  'theme_yellow': {
    'default': '#EDDC96'
  },
  'theme_magenta': {
    'default': '#e39ef7'
  },
  'theme_brightMagenta': {
    'default': '#e39ef7'
  },
  'theme_cyan': {
    'default': '#5fcbd8'
  },
  'theme_brightBlue': {
    'default': '#5fcbd8'
  },
  'theme_brightCyan': {
    'default': '#5fcbd8'
  },
  'theme_blue': {
    'default': '#5fcbd8'
  },
  'theme_white': {
    'default': '#d0d0d0'
  },
  'theme_brightBlack': {
    'default': '#808080'
  },
  'theme_brightWhite': {
    'default': '#ffffff'
  }
}

AFRAME.registerComponent('xterm', {
  schema: Object.assign({
    cols: {
      default: 20
    },
    rows: {
      default: 10
    },
  }, TERMINAL_THEME),

  write: function(message) {
    this.term.write(message)
  },
  init: function () {
    const terminalElement = document.createElement('div')
    terminalElement.setAttribute('style', `
      width: 512px;
      height: 256px;
      opacity: 0.0;
    `)

    this.el.appendChild(terminalElement)

    // Build up a theme object
    const theme = Object.keys(this.data).reduce((theme, key) => {
      if (!key.startsWith('theme_')) return theme
      theme[key.slice('theme_'.length)] = this.data[key]
      return theme
    }, {})

    const term = new Terminal({
      theme: theme,
      allowTransparency: true,
      cursorBlink: true,
      disableStdin: false,
      rows: this.data.rows,
      cols: this.data.columns,
      fontSize: 32
    })

    this.term = term

    term.open(terminalElement)

    this.canvas = terminalElement.querySelector('.xterm-text-layer')
    this.canvas.id = 'terminal-' + (terminalInstance++)

    this.el.setAttribute('material', 'transparent', true)
    this.el.setAttribute('material', 'src', '#' + this.canvas.id)

    term.on('refresh', () => {
      const material = this.el.getObject3D('mesh').material
      if (!material.map) return
      material.map.needsUpdate = true
    })

    this.el.addEventListener('click', () => {
      term.focus()
    })
  }
})
