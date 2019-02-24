import { cloneElement, PureComponent } from 'react'
import PropTypes from 'prop-types'

const { oneOfType, arrayOf, node, func, string } = PropTypes

export default class SnapMidtrans extends PureComponent {
  state = {
    children: null,
  }

  constructor(props) {
    super(props)

    // bind react-midtrans method
    this.mergeWithChildren = this.mergeWithChildren.bind(this)
    this.onLoad = this.onLoad.bind(this)
    this.currentViewport = document
      .getElementsByTagName('meta')
      .hasOwnProperty('viewport')
      ? document.getElementsByTagName('meta').viewport
      : ''
    this.snapScript = document.createElement('script')

    if (process.env.NODE_ENV === 'production') {
      this.snapScript.src = 'https://app.midtrans.com/snap/snap.js'
    } else this.snapScript.src = 'https://app.sandbox.midtrans.com/snap/snap.js'

    this.snapScript.type = 'text/javascript'
    this.snapScript.onload = this.onLoad
    this.snapScript.dataset.clientKey = props.clientKey
  }

  onLoad(e) {
    if ('snap' in window) {
      const { snap } = window
      this.setState({ snap })
    }
  }

  componentDidMount() {
    document.head.appendChild(this.snapScript)
    this.mergeWithChildren(this.props.children)
  }

  mergeWithChildren(children) {
    children = cloneElement(
      children,
      // Assign new Props
      {
        onClick: () => {
          // If Children have a onClick
          children.onClick && children.onClick()
          this.state.snap.show()
        },
      },
    )

    this.setState({
      children,
    })
  }

  render() {
    return this.state.children
  }
}

SnapMidtrans.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired,
  clientKey: string.isRequired,

  /* @see @link {https://snap-docs.midtrans.com/#snap-js|Midtrans API 4 Callback} */
  onSuccess: func,
  onPending: func,
  onError: func,
  onClose: func,

  /* Callback Or Custom onClick */
  onClick: func,
}
