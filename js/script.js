function filterTools() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let tools = document.getElementsByClassName("tool");

    for (let i = 0; i < tools.length; i++) {
        let text = tools[i].innerText.toLowerCase();

        if(text.includes(input)){
            tools[i].style.display = "";
        } else {
            tools[i].style.display = "none";
        }
    }
}