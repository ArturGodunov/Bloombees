'use strict';

var app = (function () {
    /**
     * Constants
     * */
    var URL_DATA = 'goods.json',
        GOODS_HOVER_BUTTON_TITLE = 'Посмотреть и купить',
        DETAILS_CARD_BUTTON_TITLE = 'Купить сейчас',
        SRC_IMG = 'images/',
        ID_DETAILS_CARD = 'detailsCard',
        ID_DETAILS_CARD_IMG = 'detailsCardImg',
        ID_DETAILS_CARD_TITLE = 'detailsCardTitle',
        ID_DETAILS_CARD_DESC = 'detailsCardDesc',
        CLASS_NAME_DETAILS_CARD_CONTENT = 'u-align--container u-box-shadow u-background--white',
        CLASS_NAME_DETAILS_CARD_TITLE = 'u-margin-title--m u-font-size--3xl',
        CLASS_NAME_NAV_SLIDER = 'c-nav-slider',
        CLASS_NAME_NAV_SLIDER_ITEM = 'c-nav-slider-item',
        CLASS_NAME_NAV_IMG_SLIDER = 'c-nav-img-slider',
        CLASS_NAME_NAV_IMG_SLIDER_ITEM = 'c-nav-img-slider-item u-box-shadow u-bg-images--contain',
        DATA_ATTR_GOODS_LINK = 'data-goods-link',
        DATA_ATTR_SLIDE = 'data-slide';

    var store;

    /**
     * Save data
     * */
    var saveData = function (response) {
        store = JSON.parse(response);

        buildGoods(store);
    };

    /**
     * Click on goods item
     * */
    var onChooseGoods = function () {
        var goods = document.getElementById('goods');
        goods.addEventListener('click', function (event) {
            event.preventDefault();
            var target = event.target;

            while (!target.hasAttribute(DATA_ATTR_GOODS_LINK) || target !== goods) {
                if (target.hasAttribute(DATA_ATTR_GOODS_LINK)) {
                    window.location.hash = target.getAttribute('href');

                    return;
                } else {
                    if (target.tagName !== 'BODY') {
                        target = target.parentNode;
                    } else {
                        return;
                    }
                }
            }
        });
    };

    /**
     * Handler of changing url
     * */
    var onPopState = function () {
        window.addEventListener('popstate', function () {
            var hash = window.location.hash;

            buildDetailsCard(hash);
        });
    };

    /**
     * Build goods
     * */
    var buildGoods = function (data) {
        var goods = document.getElementById('goods');

        data.forEach(function (item) {
            var li = document.createElement('li');
            li.className = 'c-goods-item u-box-shadow';

            li.innerHTML =
                '<a href="' + item.id + '" ' + DATA_ATTR_GOODS_LINK + ' class="c-goods-link u-bg-images--contain"' +
                ' style=\'background-image: url("' + SRC_IMG + item.img + '");\'>' +
                '<span class="c-goods-link-hover">' +
                '<span class="c-goods-link-hover-text">' + GOODS_HOVER_BUTTON_TITLE + '</span>' +
                '</span>' +
                '</a>' +
                '<p class="c-goods-sign">' + item.name +
                '<strong class="u-display--block u-font-weight--bold">' + item.costEU + '</strong>' +
                '</p>';

            goods.appendChild(li);
        });
    };

    /**
     * Build details card
     * */
    var buildDetailsCard = function (hash) {
        var id = hash.replace('#', ''),
            detailItem = store.filter(function (item) {
                return item.id === id;
            })[0];

        var detailsCard = document.getElementById(ID_DETAILS_CARD),
            detailsCardTitle = document.createElement('h2'),
            detailsCardContent = document.createElement('section'),
            itemContent =
                '<div class="c-details-card-img u-bg-images--contain" id=' + ID_DETAILS_CARD_IMG +
                ' style=\'background-image: url("' + SRC_IMG + detailItem.img2 + '");\'></div>' +
                '<div class="c-details-card-desc">' +
                '<p class="u-margin-title--sm u-font-size--xxl">' + detailItem.costEU + '</p>' +
                '<p>' + detailItem.costBR + '</p>' +
                '<a href="" class="c-btn c-btn--block c-btn--green u-font-size--l">' + DETAILS_CARD_BUTTON_TITLE + '</a>' +
                '<p class="u-font-color--grey-lighter u-line-height--big">' + detailItem.desc + '</p>' +
                '</div>';

        if (detailsCard.children.length) {
            document.getElementById(ID_DETAILS_CARD_TITLE).innerHTML = detailItem.name;
            document.getElementById(ID_DETAILS_CARD_DESC).innerHTML = itemContent;
        } else {
            detailsCardTitle.className = CLASS_NAME_DETAILS_CARD_TITLE;
            detailsCardTitle.id = ID_DETAILS_CARD_TITLE;
            detailsCardTitle.innerHTML = detailItem.name;

            detailsCardContent.className = CLASS_NAME_DETAILS_CARD_CONTENT;
            detailsCardContent.id = ID_DETAILS_CARD_DESC;
            detailsCardContent.innerHTML = itemContent;

            detailsCard.appendChild(detailsCardTitle);
            detailsCard.appendChild(detailsCardContent);
        }

        buildDetailsCardImgSlider(detailItem);
    };

    /**
     * Build slider of images in details card
     * */
    var buildDetailsCardImgSlider = function (detailItem) {
        var detailsImgArr = detailItem.img3 ? detailItem.img3 : '';

        if (detailsImgArr.length) {
            var navSlider = document.createElement('ul'),
                navImgSlider = document.createElement('ul');

            navSlider.className = CLASS_NAME_NAV_SLIDER;
            navImgSlider.className = CLASS_NAME_NAV_IMG_SLIDER;

            detailsImgArr.forEach(function (item, i) {
                var navSliderItem = document.createElement('li'),
                    navImgSliderItem = document.createElement('li');

                navSliderItem.className = i === 0 ? CLASS_NAME_NAV_SLIDER_ITEM + ' active' : CLASS_NAME_NAV_SLIDER_ITEM;
                navSliderItem.setAttribute(DATA_ATTR_SLIDE, i);

                navImgSliderItem.className =
                    i === 0 ? CLASS_NAME_NAV_IMG_SLIDER_ITEM + ' active' : CLASS_NAME_NAV_IMG_SLIDER_ITEM;
                navImgSliderItem.setAttribute('style', 'background-image: url("' + SRC_IMG + item + '")');
                navImgSliderItem.setAttribute(DATA_ATTR_SLIDE, i);

                navSlider.appendChild(navSliderItem);
                navImgSlider.appendChild(navImgSliderItem);
            });

            document.getElementById(ID_DETAILS_CARD_IMG).appendChild(navSlider);
            document.getElementById(ID_DETAILS_CARD).appendChild(navImgSlider);

            onChangeSliderItem(navSlider, navImgSlider, detailItem);
        }
    };

    /**
     * Change slides in details card slider
     * */
    var onChangeSliderItem = function (navSlider, navImgSlider, detailItem) {
        navSlider.addEventListener('click', onChangeSlide);
        navImgSlider.addEventListener('click', onChangeSlide);

        function onChangeSlide() {
            var target = event.target;

            while (!target.hasAttribute(DATA_ATTR_SLIDE) || target !== navSlider || target !== navImgSlider) {
                if (target.hasAttribute(DATA_ATTR_SLIDE)) {
                    var slideNumber = +target.getAttribute(DATA_ATTR_SLIDE);

                    document.getElementById(ID_DETAILS_CARD_IMG).style.backgroundImage =
                        'url("' + SRC_IMG + detailItem.img3[slideNumber] + '")';

                    var navSliderAll = document.querySelectorAll('[' + DATA_ATTR_SLIDE + ']');
                    Array.prototype.forEach.call(navSliderAll, function (item) {
                        var itemNumber = +item.getAttribute(DATA_ATTR_SLIDE);

                        if (itemNumber !== slideNumber) {
                            item.classList.remove('active');
                        } else {
                            item.classList.add('active');
                        }
                    });

                    return;
                } else {
                    if (target.tagName !== 'BODY') {
                        target = target.parentNode;
                    } else {
                        return;
                    }
                }
            }
        }
    };

    return {
        /**
         * Get data
         * */
        getData: function () {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', URL_DATA, true);
            xhr.send();

            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert('Data loading error.\n' + xhr.status + ': ' + xhr.statusText);
                } else {
                    saveData(xhr.responseText);
                }
            }
        },

        /**
         * Initialization
         * */
        init: function () {
            onChooseGoods();
            onPopState();
            app.getData();
        }
    }
})();

/**
 * Dom ready
 * */
document.addEventListener('DOMContentLoaded', app.init);