'use strict'

class DSS{

    #slider_data = {
        allSlides: null,
        mainSlides: null,
        countExtraSlides: 0,
        countMainSlides: 0,
        countAllSlides: 0,
        activeSlideID: 0,
        bulletsBar: null,
        containerWidth: 0,
        slideWidth: 0,
        sliderName: null,
        sliderClass: null,
        trackClass: null,
        trackXPos: 0,
        thumbClass: null,
        thumbTrackWidth: 0,
        thumbTrackXPos: 0,
    }

    #current_settings = {
        autoPlaySlider:         true,
        autoPlayDelay:          1500,
        autoPlayDirrection:     "left",
        arrows:                 true,
        prewArrow:              "a_left",
        nextArrow:              "a_right",
        bullets:                true,
        bulletsEffect:          "bullet-pull",
        endlessSlider:          true,
        autoSetterMargins:      false,
        presentationMode:       true,
        thumbSlidesClassName:   "slide-thumb",
        speedAnimation:         500,
        transition:             "ease-in-out",
        swipeScroll:            false,
    };

    infSlider; autoPlaySlider; APdirrection; autoMargin; timeAnim; delayAP; PMtoggle; PMslidesClassName;
    leftArrow; rightArrow; transitionType; bulletEffects; bulletsToggle; arrowToggle; swipeToggle;
    windowWidth; thumbWidth;

    #thumbTrackIsDelayed = false

    margin = 0; indexTarget; firstCondition; secondCondition;
    #isDelayed = false; #autoplay = null;

    constructor(name, settings = this.#current_settings) {

        let _ = this;

        _.checkSettings(settings);

        _.infSlider = _.#current_settings.endlessSlider;
        _.autoPlaySlider = _.#current_settings.autoPlaySlider;
        _.APdirrection = _.#current_settings.autoPlayDirrection;
        _.autoMargin = _.#current_settings.autoSetterMargins;
        _.timeAnim = _.#current_settings.speedAnimation;
        _.delayAP = _.#current_settings.autoPlayDelay;
        _.PMtoggle = _.#current_settings.presentationMode;
        _.PMslidesClassName = _.#current_settings.thumbSlidesClassName;
        _.leftArrow = _.#current_settings.prewArrow;
        _.rightArrow = _.#current_settings.nextArrow;
        _.transitionType = _.#current_settings.transition;
        _.bulletEffects = _.#current_settings.bulletsEffect
        _.bulletsToggle = _.#current_settings.bullets
        _.arrowToggle = _.#current_settings.arrows
        _.swipeToggle = _.#current_settings.swipeScroll
        _.windowWidth = window.innerWidth / 2;

        _.#slider_data.sliderName = name.slice(1, name.length);
        _.#slider_data.sliderClass = document.querySelector(name);

        _.buildCarousel();

        _.indexTarget = this.infSlider ? this.#slider_data.countExtraSlides : 0;

        // try{
        //     if (this.PMtoggle && this.#slider_data.sliderClass.querySelector(`${this.#slider_data.sliderName}-thumb`).childNodes.length >= 3) this.argsPM = presentationMode();
        // } catch(e) {
        //     alert(e);
        // }

        _.setPosition(0);
        _.controlEvents();

    }

    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //

    checkSettings(params){
        if (params === this.#current_settings) return 0;
        else{
            for (let defaultParameter in this.#current_settings) {
                for (let customParameter in params){
                    if(customParameter === defaultParameter) this.#current_settings[customParameter] = params[customParameter];
                }
            }
        }
    }

    /**
     * Методы построения слайдера
     */

    // Метод мигрирования элементов слайдера в родительский тег //

    slideBuild(){

        let div = document.createElement("div"),
            slides = document.querySelectorAll(`.${this.#slider_data.sliderName} > div`);

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


        div.className = `${this.#slider_data.sliderName}-track`;

        for (let i = 0; i < slides.length; i++) div.append(slides[i]);

        this.#slider_data.sliderClass.append(div);

    }

    // Функция присвайвания ID слайдам //

    classIndent(items){

        for (let j = 0; j < items.length; j++){
            if(this.infSlider) { items[j].classList.add("slide"); items[j].setAttribute("indexItem", j - this.#slider_data.countExtraSlides); }
            else { items[j].classList.add("slide"); items[j].setAttribute("indexItem", j); }
        }

        if(this.infSlider) items[this.#slider_data.countExtraSlides].classList.add("active");
        else items[0].classList.add("active");

        this.#slider_data.activeSlideID = this.infSlider ? this.#slider_data.countExtraSlides : 0;

    }

    // Функция построения стрелок //

    buildButtons(container){

        for (let _ of [this.leftArrow, this.rightArrow]) {

            let el = document.createElement("button");
            el.classList.add("a-bar"); el.id = _;
            _ === this.leftArrow ? container.prepend(el) : container.append(el);

        }

    }

    // Подготовка индикации слайдера //

    bullets(array){

        let bulletsBar = document.createElement("div");

        this.buildBulletsBar(this.#slider_data.sliderClass, bulletsBar, array)
        this.#slider_data.bulletsBar.firstChild.classList.add(this.bulletEffects);

    }

    // Функция построения дотс-бара //

    buildBulletsBar(container, bulletsBar){

        bulletsBar.classList = "bullets-bar";
        container.append(bulletsBar);

        this.#slider_data.bulletsBar = this.#slider_data.sliderClass.querySelector(`.${this.#slider_data.sliderName} .bullets-bar`);

        let countItems = this.infSlider === true ? this.#slider_data.allSlides.length - (2 * this.#slider_data.countExtraSlides) : this.#slider_data.allSlides.length;

        for (let i = 0; i < countItems; i++){

            let bullet = document.createElement("div");

            bullet.classList = "bullet";
            bullet.setAttribute("indexItem", i);
            bullet.style.transition = `${this.timeAnim}ms ${(this.transitionType)}`;
            this.#slider_data.bulletsBar.append(bullet);

        }

    }

    buildPM(props, arrayMS, width){

        let classes = {
            thumbBlock: `${this.#slider_data.sliderName}-thumb-block`,
            thumbConts: `${this.#slider_data.sliderName}-thumb-container`,
            slideThumb: `${this.#slider_data.sliderName}-thumb-track`,
        }

        for (const block in classes) {
            let element = document.createElement("div");
            element.className = classes[block];
            classes[block] = element;
        }

        for (let elem of arrayMS) {
            let temp = elem.cloneNode(true);
            temp.classList.remove("slide");
            temp.style.marginLeft = temp.style.marginRight = temp.style.width = null;
            classes.slideThumb.append(temp);
        }

        this.#slider_data.sliderClass.append(classes.thumbConts);
        (classes.thumbConts).append(classes.slideThumb);

        // Создаём стили эскизов для масштабирование шрифта/картинок //

        let thumbnailDiv = this.#slider_data.sliderClass.querySelectorAll(`.${this.#slider_data.sliderName}-thumb-track > div`),
            countDivs = thumbnailDiv.length;

        for (let i = 0; i < countDivs; i++) thumbnailDiv[i].classList.add(this.PMslidesClassName);

        this.#slider_data.thumbClass = this.#slider_data.sliderClass.querySelector(`.${this.#slider_data.sliderName}-thumb-container`);
        this.#slider_data.sliderClass.append(classes.thumbBlock);
        (classes.thumbBlock).append(this.#slider_data.thumbClass);

        let allThumbs = this.#slider_data.sliderClass.querySelectorAll(`.${this.#slider_data.sliderName} .${this.PMslidesClassName}`);

        for(let i of allThumbs) {
            for(let j = 0; j < i.childNodes.length; j++){
                (i.childNodes[j]).style.transform = `scale(${5/16}, ${5/16})`
            }
        }

        let tt = this.#slider_data.thumbClass.firstChild, // thumb track
            mt = parseInt(getComputedStyle(tt.firstChild, true).marginLeft), // left and right margin thumb
            ttw = this.#slider_data.thumbTrackWidth = Math.ceil(((tt.firstChild.clientWidth) + (2 * mt)) * Array.from(tt.childNodes).length); // thumb track width

        this.thumbTrackSetProps(tt, ttw, width)

        tt.firstChild.classList.remove("active");
        tt.firstChild.classList.add('thumb-active');

    }

    thumbTrackSetProps(obj, w1, w2){

        if (w1 <= w2) {
            obj.style.justifyContent = "center";
            this.#slider_data.thumbClass.firstChild.style.transform = `translate3d(0px, 0px, 0px)`;
        }
        else {
            obj.style.justifyContent = null;
            this.#slider_data.thumbClass.firstChild.style.transform = `translate3d(${this.#slider_data.thumbTrackXPos}px, 0px, 0px)`;
        }

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

        let sliderBlock = Array.from(document.querySelectorAll(`.${this.#slider_data.sliderName}`)[0].childNodes),
            firstBlock = document.createElement("div");

        firstBlock.className = `${this.#slider_data.sliderName}-block`;

        this.#slider_data.sliderClass.append(firstBlock);

        for (let i = 0; i < sliderBlock.length; i++) firstBlock.append(sliderBlock[i]);

    }

    secondBlockCreate(array, elems){
        arguments[1] = this.infSlider ? array.slice(this.#slider_data.countExtraSlides, array.length - this.#slider_data.countExtraSlides) : array;
    }

    elemBlocks(array1, array2, width, elems){

        this.imgFix(array2); // Подгоняем картинки под нужный размер //
        this.firstBlockCreate();  // Создаём первый блок //
        this.secondBlockCreate(array2, elems); // Создаём второй блок //
        this.SSProperties.append(this.imageProp);
        if(this.PMtoggle) this.buildPM(this.SSProperties, array1, width);

    }

    // Создание родительских тегов //

    sliderContainerBuild(track){

        let sliderWindow = document.createElement('div');
        sliderWindow.classList.add(`${this.#slider_data.sliderName}-container`)
        track.before(sliderWindow); sliderWindow.append(track);

    }

    // Настройка, отвечающая за безграничный скролл слайдера //

    endlessSlider(track, items){

        for (let i = 1; i <= this.#slider_data.countExtraSlides; i++) track.prepend(items[items.length - i].cloneNode(true));
        for (let j = 1; j <= this.#slider_data.countExtraSlides; j++) track.append(items[j + (this.#slider_data.countExtraSlides - 1)].cloneNode(true));

    }

    // Подготовка отступов //

    marginsBuild(width1, width2, _obj){

        this.margin = this.autoMargin ? width1 < width2 ? Math.abs(width2 - width1) / 2 : 0 : 0;

        if(this.autoMargin){
            for (let i of _obj.childNodes) i.style.margin = `0px ${this.margin}px`;
        }

    }

    // Построение карусели //

    buildCarousel(){

        let _ = this, _sliderData = _.#slider_data,
            _currentSettings = _.#current_settings;

        _.slideBuild();

        _sliderData.trackClass = _sliderData.sliderClass.querySelector(`.${_sliderData.sliderName}-track`);
        _sliderData.allSlides = _sliderData.trackClass.childNodes;

        let track = _sliderData.trackClass, items = _sliderData.allSlides,
            cw, sw;

        _sliderData.mainSlides = Array.from(items);
        _sliderData.countMainSlides = _sliderData.mainSlides.length;
        _.sliderContainerBuild(track);

        cw = _sliderData.containerWidth = _sliderData.sliderClass.querySelector(`.${_sliderData.sliderName}-container`).clientWidth; // width container
        sw = _sliderData.slideWidth = track.firstChild.clientWidth; // width slide

        if ((!_.infSlider && !_.autoMargin) && sw > cw) _.autoMargin = true;
        if (_.autoMargin) _.marginsBuild(sw, cw, track);

        _sliderData.countExtraSlides = _.infSlider && !_.autoMargin ? Math.floor(cw / sw) + 1:
                                      !_.infSlider && !_.autoMargin ? 1 : 1; // ES - extra slides

        if (_.infSlider) _.endlessSlider(track, items);
        if (!_.infSlider && !_.autoMargin && sw < cw) track.style.marginLeft = `${(cw - sw)/2}px`;

        let allSlides = Array.from(items),
            mainSlides = this.infSlider ? allSlides.slice(_sliderData.countExtraSlides, allSlides.length - _sliderData.countExtraSlides) : allSlides;

        _sliderData.countAllSlides = allSlides.length;

        if (_currentSettings.arrows) _.buildButtons(_sliderData.sliderClass);
        if (_currentSettings.bullets) _.bullets(items);

        _.classIndent(items);
        _.elemBlocks(mainSlides, allSlides, cw, _sliderData.mainSlides);


    }

    /** Методы, отвечающие за навигацию по слайдеру */

    // Метод автопрокрутки //

    controlAutoPlay(toggle){

        let APtarget = this.APdirrection === "right" ? -1 : 1;
        
        if(this.autoPlaySlider){
            if (toggle) this.#autoplay = setInterval(() => this.checkingScroll(this.scroll, APtarget) , this.delayAP);
            else if (!toggle) clearInterval(this.#autoplay)
        }

    }

    // Метод на проверку возможности прокрутки слайдера //

    checkingScroll(callback, direction){

        let _ = this;

        if(_.#isDelayed) return 0;
        else{
            if(_.infSlider) callback(direction);
            else {
                if ((_.indexTarget > 0 && direction === -1) || (_.indexTarget < _.#slider_data.allSlides.length - 1 && direction === 1)){
                    callback(direction);
                }
            }
        }

    }

    // Методы для прокрутки слайдера //

    scroll = target => {

        let _ = this;

        let countES = _.#slider_data.countExtraSlides,
            countSlides = _.#slider_data.countAllSlides;

        _.#isDelayed = true;
        _.indexTarget += target;
        _.firstCondition = (target === 1 && _.indexTarget === countSlides - countES && _.infSlider);
        _.secondCondition = (target === -1 && _.indexTarget === countES - 1 && _.infSlider);

        _.toggleAnimation(true, _.#slider_data.trackClass);
        _.setPosition(_.indexTarget, _.firstCondition, _.secondCondition);
        _.changeActiveSlide(_.indexTarget, _.#slider_data.activeSlideID, _.firstCondition, _.secondCondition);

        setTimeout(function (){

            _.toggleAnimation(false, _.#slider_data.trackClass);
            _.#isDelayed = false;

        }, _.timeAnim);


    }

    setPosition(target, cond1, cond2) {

        let _ = this, _target = target, track = _.#slider_data.trackClass,
            countES = _.#slider_data.countExtraSlides, countSlides = _.#slider_data.countAllSlides;

        _.setTranslate3d(_target)

        if(cond1 || cond2){

            _target = cond1 ? countES : cond2 ? countSlides - (countES + 1): target;

            setTimeout(function (){

                _.toggleAnimation(false, track);
                _.indexTarget = _target;
                _.setTranslate3d(_target)

            }, _.timeAnim)

        }

    }

    // Свайпы основного слайдера //

    #swipeScroll(toggle){

        let _ = this, mainTrack = _.#slider_data.trackClass, ratherX0 = -(window.innerWidth / 2), clicked = false,
            startDragX, currentX;

        let onDown = (event) => {

            if(_.#isDelayed) return 0;

            startDragX = ratherX0 + event.pageX;
            clicked = true;

        };

        let onMove = throttle((event) => {

            if(!clicked || _.#isDelayed) return 0;

            currentX = ratherX0 + event.pageX;
            mainTrack.style.transform = `translate3d(${_.#slider_data.trackXPos + (currentX - startDragX)}px, 0px, 0px)`;

            if (startDragX - currentX > 150 || startDragX - currentX < -150){

                clicked = false;
                this.checkingScroll(this.scroll, startDragX - currentX > 150 ? 1 : -1);
                this.overscrollAnim(mainTrack, _.#slider_data.trackXPos, "main");

            }

        }, 1/60);

        let onUp = () => {

            if(!clicked) return 0;

            clicked = false;
            this.overscrollAnim(mainTrack, _.#slider_data.trackXPos, "main")

        };

        this.swipesEvents(mainTrack.parentNode, mainTrack, onDown, onMove, onUp, toggle);
    }

    // Метод для расчёта позиции //

    calcPos(index) {

        let sw = this.#slider_data.slideWidth,
            cw = this.#slider_data.containerWidth,
            half = (cw - sw)/2;

        return  (this.autoMargin && (this.infSlider || !this.infSlider)) ? (sw > cw ? ((-1 * sw + half) * index) - (half * (index - 1)) : -1 * cw * index) :
                (!this.autoMargin && !this.infSlider) ? (sw > cw ? half * index : -sw * index) :
                (sw < cw ? ((-1 * sw * index) + half) : ((-1 * sw + half) * index) - (half * (index - 1)));

    }

    // Метод для изменения свойства translate3d //

    setTranslate3d(target){

        let _ = this, track = _.#slider_data.trackClass;

        _.#slider_data.trackXPos = _.calcPos(target);
        track.style.transform = "translate3d(" + _.#slider_data.trackXPos + "px, 0px, 0px)";

    }

    // Методы для управления анимациями //

    toggleAnimation(toggle, obj){
        obj.style.transition = toggle ? `transform ${this.timeAnim}ms ${this.#current_settings.transition}` : null;
    }

    overscrollAnim(obj, x, type){

        if(type === "main") {
            this.#isDelayed = true;
            this.#slider_data.trackXPos = x;
        } else {
            this.#thumbTrackIsDelayed = true;
            this.#slider_data.thumbTrackXPos = x;
        }

        this.toggleAnimation(true, obj);

        obj.style.transform = `translate3d(${x}px, 0px, 0px)`;

        setTimeout(()=>{
            this.toggleAnimation(false, obj);
            if(type === "main") this.#isDelayed = false;
            else this.#thumbTrackIsDelayed = false;
        }, this.timeAnim);

    }

    // Метод для пролистывание слайдера на опр. слайд //

    target(targetSlide){

        this.controlAutoPlay(false);

        let targetIndex = !this.infSlider ? targetSlide : targetSlide + (this.#slider_data.countExtraSlides - 1);

        this.#slider_data.trackClass.style.transition = `transform ${this.timeAnim}ms ${this.#current_settings.transition}`;
        this.setPosition(targetIndex);
        this.indexTarget = targetIndex;

        setTimeout(() => {

            this.#slider_data.trackClass.style.transition = null;
            this.#isDelayed = false;
            this.controlAutoPlay(true);

        }, this.timeAnim);

    }

    // Методы смены активного слайда //

    changeActiveSlide(target, current, cond1, cond2) {

        let _ = this, _sliderData = _.#slider_data,
            countES = _sliderData.countExtraSlides,
            countSlides = _sliderData.countAllSlides;

        _.indexTarget = cond1 ? countES : cond2 ? countSlides - (countES + 1): target;

        let args = [_.indexTarget, _sliderData.activeSlideID];

        for (let i of args) {

            _.animElements(i, _sliderData.allSlides)
            if(_.bulletsToggle) _.animElements(i, _sliderData.bulletsBar.childNodes)
            if(_.PMtoggle) _.animElements(i, _sliderData.thumbClass.firstChild.childNodes)

        }

        _sliderData.activeSlideID = _.indexTarget;

    }

    animElements(index, className){

        let _ = this, _sliderData = _.#slider_data,
            _index = _.infSlider ? index - _sliderData.countExtraSlides: index;

        if(className === _sliderData.allSlides) {
            className[index].classList.toggle("active");
        } else if (className === _sliderData.bulletsBar.childNodes) {
            className[_index].classList.toggle(this.#current_settings.bulletsEffect);
        } else if (className === _sliderData.thumbClass.firstChild.childNodes) {
            className[_index].classList.toggle("thumb-active");
        }

    }

    // Режим презентации//

    #presentationMode(toggle){

        let _ = this, thumbTrack = _.#slider_data.thumbClass.firstChild,
            startDragX, currentX, clicked = false, sliderData = _.#slider_data, forceMove = 0;

        let onDown = (event) => {

            if(_.#thumbTrackIsDelayed) return 0;

            startDragX = -_.windowWidth + event.pageX;
            clicked = true;

        };

        let onMove = throttle((event) => {

            if(!clicked || _.#thumbTrackIsDelayed) return 0;

            currentX = -_.windowWidth + event.pageX;
            thumbTrack.style.transform = `translate3d(${sliderData.thumbTrackXPos + (currentX - startDragX)}px, 0px, 0px)`;
            forceMove = sliderData.thumbTrackXPos + (currentX - startDragX);

            if((sliderData.thumbTrackWidth < sliderData.containerWidth) && (forceMove >= 150 || forceMove <= - 150)){
                onUp();
            } else if ((sliderData.thumbTrackWidth > sliderData.containerWidth) && (forceMove >= 150 || forceMove <= _.thumbWidth - 150)){
                onUp();
            }


        }, 1/60);

        let onUp = () => {

            if(!clicked) return 0;

            clicked = false;
            sliderData.thumbTrackXPos = sliderData.thumbTrackXPos + (currentX - startDragX);

            if((sliderData.thumbTrackWidth > sliderData.containerWidth) && (sliderData.thumbTrackXPos > 0 || sliderData.thumbTrackXPos < _.thumbWidth)) {
                _.overscrollAnim(thumbTrack, (_.#slider_data.thumbTrackXPos > 0 ? 0 : _.thumbWidth) );
            } else if ((sliderData.thumbTrackWidth < sliderData.containerWidth) && (sliderData.thumbTrackXPos > 0 || sliderData.thumbTrackXPos < 0)){
                _.overscrollAnim(thumbTrack, 0);
            }

        };

        this.swipesEvents(_.#slider_data.thumbClass, thumbTrack, onDown, onMove, onUp, toggle);

    }

    /** Методы, отвечающие за создание эвентов */

    // Эвенты для стрелок //

    arrowsEvents = (sliderClass, callback) => {

        for (let arrow of sliderClass) {
            arrow.onclick = () => {
                let target = arrow.id === this.leftArrow ? -1 : 1;
                this.checkingScroll(callback, target)
            }
        }

    }

    // Эвенты для точек навигации //

    bulletsEventsCreate(toggle) {

        let _ = this, bulletsBar = _.bulletsToggle ? _.#slider_data.bulletsBar.childNodes : null;

        if(toggle){
            for (let bullet of bulletsBar) bullet.onclick = () => _.actionBullets(bullet)
        }

    }

    actionBullets = obj => {

        if(this.#isDelayed) return 0;

        this.#isDelayed = true;

        let targetIndex = parseInt(obj.getAttribute("indexItem")),
            targetSlide = this.infSlider ? targetIndex + this.#slider_data.countExtraSlides : targetIndex;

        this.changeActiveSlide(targetSlide, this.#slider_data.activeSlideID)   ;
        this.target(targetSlide);

    }

    // Эвенты для свайпов //

    swipesEvents(wrapper, obj, callback1, callback2, callback3, toggle){

        function afterEnter(obj, toggle){

            obj.onpointerdown = !toggle ? null : (event) => callback1(event)
            obj.onpointermove = !toggle ? null : (event) => callback2(event)
            obj.onpointerup = !toggle ? null : () => callback3()

        }

        wrapper.onpointerenter = !toggle ? null :  () => afterEnter(obj, toggle);
        wrapper.onpointerleave = !toggle ? null : () => callback3()

    }

    // Создание эвентов //

    // Адаптивность, ещё пока в разработке //

    adaptive(){

        let _ = this, sliderData = _.#slider_data,
            windowWidth = window.innerWidth, thumbClass = _.#slider_data.thumbClass

        sliderData.thumbTrackWidth = thumbClass.firstChild.clientWidth;

        _.windowWidth = windowWidth / 2;
        _.thumbWidth = -sliderData.thumbTrackWidth + thumbClass.clientWidth;
        sliderData.slideWidth = sliderData.trackClass.firstChild.clientWidth;
        sliderData.containerWidth = sliderData.sliderClass.querySelector(`.${sliderData.sliderName}-container`).clientWidth;

        _.marginsBuild(sliderData.slideWidth, sliderData.containerWidth, sliderData.trackClass)
        _.setTranslate3d(sliderData.activeSlideID);
        _.thumbTrackSetProps(sliderData.thumbClass, sliderData.thumbTrackWidth, sliderData.containerWidth)

    }

    eventsToggle(toggle){

        let _ = this;

        // Адаптивность, ещё пока в разработке //

        window.onresize = !toggle ? null : debounce(() => _.adaptive(), 1/50 * 1000);

        if (_.bulletsToggle) _.bulletsEventsCreate(toggle);
        if (_.arrowToggle) {
            _.arrowsEvents(_.#slider_data.sliderClass.querySelectorAll(`.${_.#slider_data.sliderName} .a-bar`), _.scroll);
        }

        _.controlAutoPlay(toggle);

        if (_.PMtoggle) _.#presentationMode(toggle);
        if (_.swipeToggle) _.#swipeScroll(toggle);

    }

    // Контроль эвентов //

    controlEvents(){
        window.addEventListener('load', () => {
            if (document.visibilityState === "hidden") this.eventsToggle(false)
            else this.eventsToggle(true)
            this.adaptive()
        })
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === "hidden") this.eventsToggle(false)
            else this.eventsToggle(true)
            this.adaptive()
        })
    }

}

// ======================= //
// Вспомогательные функции //
// ======================= //

// function logBase(x, y){
//
//     return Math.log(y) / Math.log(x);
//
// }
//
// function logAnimGraphic(x, constant){
//
//     return Math.round((10*((logBase(2, x - constant) ** 3)))** 0.5);
//
// }

function throttle(func, delay) {

    let isThrottled = false,
        savedArgs,
        savedThis;

    return function wrapper() {

        if (isThrottled) {

            savedArgs = arguments;
            savedThis = this;

            return;

        }

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout((function() {

            isThrottled = false;

            if (savedArgs) {

                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;

            }

        }), delay);

    }

}

function debounce(func, delay) {

    let isDebounced = false;

    return function() {

        if (isDebounced) return;

        func.apply(this, arguments);

        isDebounced = true;

        setTimeout(() => isDebounced = false, delay);

    };

}