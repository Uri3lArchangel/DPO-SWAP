export function blur(){
    let background = document.getElementById("main") as HTMLDivElement;
    background.style.filter = "blur(10px)";
}

export function unblur(){
    let background = document.getElementById("main") as HTMLDivElement;
    background.style.filter = "blur(0)";
}