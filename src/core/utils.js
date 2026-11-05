/**
 * 
 * @param {String} text 
 * @param {() => void} onDisplayEnd
 */
export function displayDialogue(text, onDisplayEnd) {
  /** @type {HTMLDivElement | null} */
  const dialogueUI = document.querySelector("#textbox-container");

  /** @type {HTMLParagraphElement | null} */
  const dialogue = document.querySelector("#dialogue");

    if (!dialogueUI || !dialogue) {
    throw new Error("#textbox-container ou #dialogue introuvable dans index.html");
  }

    dialogueUI.style.display = "block";

    let index=0
    let currentText = ""

    const intervalRef = setInterval(()=>{
            if (index<text.length) {
                currentText += text[index]
                dialogue.innerHTML =  currentText
                index++
                return
            
            }
            clearInterval(intervalRef)
    },5)

    const closeButton = 
        /** @type {HTMLButtonElement | null} */ (document.querySelector("button#close"));

    if (!closeButton) {
        throw new Error("button#close introuvable dans index.html");
        }
    const onCloseButtonClick =()=>{
        onDisplayEnd()
        dialogueUI.style.display = "none"
        dialogue.innerHTML = ""
        clearInterval(intervalRef);
        closeButton.removeEventListener("click",onCloseButtonClick)
    }
    closeButton.addEventListener("click",onCloseButtonClick)

    
}
/**
 * @param {import("kaboom").KaboomCtx} k 
 */
export function setCamScale(k){
    const resizeFactor =  k.width()/ k.height()
    if(resizeFactor<1){
        k.camScale(k.vec2(1))
    }else{
        return ;
    }
    k.camScale(k.vec2(1.5))
}