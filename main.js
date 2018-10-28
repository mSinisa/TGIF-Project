function hideAndShow(){
var dots= document.getElementById("dots");
var moreText = document.getElementById("moreText");
var btnText=document.getElementById("textButton");
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

hideAndShow();

function hideAndShow2(){
var dots= document.getElementById("dots2");
var moreText = document.getElementById("moreText2");
var btnText=document.getElementById("textButton2");
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

hideAndShow2();