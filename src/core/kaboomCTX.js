import './style.css'
import kaboom from 'kaboom'

export const kaboomCtx=kaboom({
  global:false,
  touchToMouse:true,
  canvas:document.querySelector("canvas#game")
})