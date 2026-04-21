import './style.css'
import { mountApp } from './tracker/app'

const root = document.querySelector<HTMLDivElement>('#app')
if (!root) {
  throw new Error('Missing #app element')
}

mountApp(root)
