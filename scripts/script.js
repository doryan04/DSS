let NumberItem = 0;

function classIndent(){
    const galleryItems = document.querySelectorAll(".photos > div");
    let countItems = galleryItems.length;
    for (let i = 0; i < countItems; i++){
        galleryItems[i].classList = "slide";
    }
}

function rainbowItems(){
    let items = document.getElementsByClassName("slide");
    for (let j = 0; j < items.length; j++){
        items[j].style.backgroundColor = "hsl(" + (50 * (j+1)) +", 100%, 23%)";
    }
}

function scrollPrewPic(){
    if (NumberItem > 0){
        NumberItem--;
        let items = document.getElementsByClassName("slide");
        let widthItem = items[0].clientWidth;
        for (let i = 0; i < items.length; i++){
            items[i].style.transform = "translateX(-"+ (widthItem * (NumberItem)) +"px)";
        }
    }
}

function scrollNextPic(){
    if (NumberItem < 7){
        NumberItem++;
        let items = document.getElementsByClassName("slide");
        let widthItem = items[0].clientWidth;
        for (let i = 0; i < items.length; i++){
            items[i].style.transform = "translateX(-"+ (widthItem * NumberItem) +"px)";
        }
    }
}