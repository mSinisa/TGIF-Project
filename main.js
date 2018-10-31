function hideAndShow(id1, id2, id3){
var dots= document.getElementById(id1);
var moreText = document.getElementById(id2);
var btnText=document.getElementById(id3);
btnText.addEventListener("click", function(){ 
    if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "+ Read more"; 
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "- Read less"; 
    moreText.style.display = "inline";
  }
});
}

hideAndShow("dots2", "moreText2", "textButton2");
hideAndShow("dots", "moreText", "textButton");
