'use strict'

class DSS{

    nameSlider; elementSlider; datas; mainItems; thumbContainer;

    constructor(name, settings) {

        this.checkSettings(settings);
        this.nameSlider = name.slice(1, name.length);
        this.elementSlider = document.querySelector(name);
        this.datas = this.buildCarousel();

    }

    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //

    checkSettings(params){
        if (params === undefined) params = currentSettings;
        else{
            for (let defaultParameter in currentSettings){
                if(params[defaultParameter] !== undefined) currentSettings[defaultParameter] = params[defaultParameter];
            }
        }
    }

    // =========================== //
    // Функции построения слайдера //
    // =========================== //

    // Функция мигрирования элементов слайдера в родительский тег //

    slideBuild(){

        let div = document.createElement("div"),
            slides = document.querySelectorAll(`.${this.nameSlider} > div`);

        // Перенос текста в отдельный <div> элемент //

        for (let slide of slides){

            let _ = slide.childNodes,
                div = document.createElement("div"),
                checkIMG = false, index = 0;
            div.classList.add("_objects");

            for (let j of _) {
                if (j.nodeName === "IMG") checkIMG = true;
            }

            if(checkIMG) {
                while(_.length !== 1) _[index].nodeName === "IMG" ? index++ : div.append(_[index]);
            } else {
                while(_.length !== 0) div.append(_[index]);
            }

            slide.append(div);

        }


        div.className = `${this.nameSlider}-track`;

        for (let i = 0; i < slides.length; i++) div.append(slides[i]);

        this.elementSlider.append(div);

    }

    // Функция присвайвания ID слайдам //

    classIndent(items, track){

        for (let j = 0; j < items.length; j++){
            if(infSlider) { items[j].classList.add("slide"); items[j].setAttribute("indexItem", j - countES); }
            else { items[j].classList.add("slide"); items[j].setAttribute("indexItem", j); }
        }

        if(infSlider) {
            items[countES].classList.add("active");
            track.style.transform = `translate3d(-${(track.querySelector("div").clientWidth * (countES - 1))}px, 0px, 0px)`;
        } else {
            track.firstChild.classList.add("active");
        }

    }

    // Функция построения стрелок //

    buildButtons(container){

        for (let _ of [leftArrow, rightArrow]) {

            let el = document.createElement("button");
            el.classList.add("a-bar"); el.id = _;
            _ === leftArrow ? container.prepend(el) : container.append(el);

        }

    }

    // Функция построения дотс-бара //

    buildBulletsBar(container, bulletsBar, items){

        bulletsBar.classList = "bullets-bar";
        container.append(bulletsBar);

        bulletsBarContainer = this.elementSlider.querySelector(`.${this.nameSlider} .bullets-bar`);

        let countItems = infSlider === true ? items.length - (2 * countES) : items.length;

        for (let i = 0; i < countItems; i++){

            let bullet = document.createElement("div");

            bullet.classList = "bullet";
            bullet.setAttribute("indexItem", i);
            bullet.style.transition = `${timeAnim}ms ${(settings.transition)}`;
            bulletsBarContainer.append(bullet);

        }

    }

    // secondBlock это <slider_name>-thumb-block .aka containers[0]
    // sliderThumbCont это <slider_name>-thumb-container .aka containers[1]
    // sliderThumb это <slider_name>-thumb .aka containers[2]
    // MS - Main Slides; MSFS - Main Slides Fonts Size; iMSFSS - index of Main Slides Fonts Size Set

    buildPM(props, arrayMS, width){

        let classes = {
            thumbBlock: `${this.nameSlider}-thumb-block`,
            thumbConts: `${this.nameSlider}-thumb-container`,
            slideThumb: `${this.nameSlider}-thumb`,
        }

        console.log("before: ");
        console.log(classes);

        for (const block in classes) {
            let element = document.createElement("div");
            element.className = classes[block];
            classes[block] = element;
        }

        console.log("after: ");
        console.log(classes);

        for (let elem of arrayMS) {
            let temp = elem.cloneNode(true);
            temp.classList.remove("slide");
            temp.style.marginLeft = temp.style.marginRight = temp.style.width = null;
            classes.slideThumb.append(temp);
        }

        this.elementSlider.append(classes.thumbConts);
        (classes.thumbConts).append(classes.slideThumb);

        // Создаём стили эскизов для масштабирование шрифта/картинок //

        let thumbnailDiv = this.elementSlider.querySelectorAll(`.${this.nameSlider}-thumb > div`),
            countDivs = thumbnailDiv.length;

        for (let i = 0; i < countDivs; i++) thumbnailDiv[i].classList.add(PMslidesClassName);

        // let allT = slider.querySelectorAll(`${this.nameSlider} .${PMslidesClassName}`)
        //
        // console.log(allT);


        this.thumbContainer = this.elementSlider.querySelector(`.${this.nameSlider}-thumb-container`);
        this.elementSlider.append(classes.thumbBlock);
        (classes.thumbBlock).append(this.thumbContainer);

        let tt = this.thumbContainer.firstChild, // thumb track
            mt = parseInt(getComputedStyle(tt.firstChild, true).marginLeft), // left and right margin thumb
            ttw = Math.ceil(((tt.firstChild.clientWidth) + (2 * mt)) * Array.from(tt.childNodes).length); // thumb track width

        if (ttw <= width) tt.parentElement.style.justifyContent = "center";

        tt.firstChild.classList.remove("active");
        tt.firstChild.classList.add('thumb-active');

    }

    // Подгонка картинок под нужный размер //

    imgFix(array){
        for (let slide of array){
            for (let element of slide.childNodes){
                if(element.nodeName === "IMG") element.classList.add("img-slide");
            }
        }
    }

    // Разделение галереи и предпросмотра эскизов на блоки //

    imageProp = `.img-slide{\nwidth: inherit;\nheight: inherit;\npointer-events: none;\nborder-radius: inherit;
                 \nposition: absolute;\n}\n._objects{\nz-index:2;\n}\n`;
    SSProperties = document.querySelectorAll("head > style")[0]; // Все стили тута

    firstBlockCreate(){

        let sliderBlock = Array.from(document.querySelectorAll(`.${this.nameSlider}`)[0].childNodes),
            firstBlock = document.createElement("div");

        firstBlock.className = `${this.nameSlider}-block`;

        this.elementSlider.append(firstBlock);

        for (let i = 0; i < sliderBlock.length; i++) firstBlock.append(sliderBlock[i]);

    }

    secondBlockCreate(array, elems){
        elems = infSlider ? array.slice(countES, array.length - countES) : array;
    }

    elemBlocks(array1, array2, width, elems){

        this.imgFix(array2); // Подгоняем картинки под нужный размер //
        this.firstBlockCreate();  // Создаём первый блок //
        this.secondBlockCreate(array2, elems); // Создаём второй блок //
        this.SSProperties.append(this.imageProp);
        if(PMtoggle) this.buildPM(this.SSProperties, array1, width);

    }

    // Создание родительских тегов //

    sliderContainerBuild(track){

        let sliderWindow = document.createElement('div');
        sliderWindow.classList.add(`${this.nameSlider}-container`)
        track.before(sliderWindow); sliderWindow.append(track);

    }

    // Настройка, отвечающая за безграничный скролл слайдера //

    endlessSlider(track, items){

        for (let i = 1; i <= countES; i++) track.prepend(items[items.length - i].cloneNode(true));
        for (let j = 1; j <= countES; j++) track.append(items[j + (countES - 1)].cloneNode(true));

    }

    // Подготовка индикации слайдера //

    bullets(array){

        let bulletsBar = document.createElement("div");

        this.buildBulletsBar(this.elementSlider, bulletsBar, array);
        bulletsBarContainer.firstChild.classList.add(currentSettings.bulletsEffect);
        return bulletsBarContainer;

    }

    // Подготовка отступов //

    marginsBuild(width1, width2, _obj){

        margin = autoMargin ? width1 < width2 ? Math.abs(width2 - width1) / 2 : 0 : 0;

        if(autoMargin && width1 < width2){
            for (let i of _obj.childNodes) i.style.marginLeft = i.style.marginRight = `${margin}px`;
        }

    }

    // Построение карусели //

    buildCarousel(){

        this.slideBuild();

        let track = this.elementSlider.querySelector(`.${this.nameSlider}-track`),
            items = track.childNodes, cw, sw;

        this.mainItems = Array.from(items);
        this.sliderContainerBuild(track);

        cw = this.elementSlider.querySelector(`.${this.nameSlider}-container`).clientWidth; // width container
        sw = track.firstChild.clientWidth; // width slide

        if ((!infSlider && !autoMargin) && sw > cw) autoMargin = true;
        if (autoMargin) this.marginsBuild(sw, cw, track);

        countES = infSlider && !autoMargin ? Math.floor(cw / sw) + 1:
            !infSlider && !autoMargin ? 1 : 1; // ES - extra slides

        if (infSlider) this.endlessSlider(track, items);
        if (!infSlider && !autoMargin && sw < cw) track.style.marginLeft = `${(cw - sw)/2}`;

        let allSlides = Array.from(items),
            mainSlides = infSlider ? allSlides.slice(countES, allSlides.length - countES) : allSlides;

        if (currentSettings.arrows) this.buildButtons(this.elementSlider);
        if (currentSettings.bullets) this.bullets(items);
        this.classIndent(items, track);
        this.elemBlocks(mainSlides, allSlides, cw, this.mainItems);

        return { track: track, items: items, sw: sw, cw: cw};

    }

}



// ===================== //
// Стандартные настройки //
// ===================== //

let currentSettings = {

        // Слайд-шоу

        autoPlaySlider:         false,
        autoPlayDelay:          1000,
        autoPlayDirrection:     "left",

        // Стрелки

        arrows:                 false,
        prewArrow:              "a_left",
        nextArrow:              "a_right",

        // Точки навигации

        bullets:                false,
        bulletsEffect:          "bullet-pull",

        // Бесконечный слайдер

        endlessSlider:          true,

        // Автоматическая настройка внешних отступов

        autoSetterMargins:      false,

        // Режим презентации

        presentationMode:       true,
        thumbSlidesClassName:   "slide-thumb",

        // Анимации

        speedAnimation:         400,
        transition:             "ease-in-out",

        // Свайпы

        swipeScroll:            false,

    },
    slider = DSS.elementSlider,
    bulletsBarContainer, ttpTemp, margin,
    timeAnim = currentSettings.speedAnimation,
    delayAP = currentSettings.autoPlayDelay,
    infSlider = currentSettings.endlessSlider,
    autoMargin = currentSettings.autoSetterMargins,
    PMtoggle = currentSettings.presentationMode,
    PMslidesClassName = currentSettings.thumbSlidesClassName,
    leftArrow = currentSettings.prewArrow,
    rightArrow = currentSettings.nextArrow,
    countES;
