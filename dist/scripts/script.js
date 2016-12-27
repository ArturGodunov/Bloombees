'use strict';

var app = (function () {
    /**
     * Constants
     * */
    var URL_DATA = 'goods.json',
        SRC_IMG = 'images/';

    var store;

    /**
     * Save data
     * */
    var saveData = function (response) {
        store = JSON.parse(response);

        buildGoods(store);
    };

    /**
     *
     * */
    var buildGoods = function (data) {
        var goods = document.getElementById('goods');

        data.forEach(function (item) {
            var goodsItemResourceInnerHTML = document.getElementById('goodsItemResource').innerHTML,
                newGoodsItem = document.createElement('li');

            newGoodsItem.className = 'c-goods-item u-box-shadow';

            goodsItemResourceInnerHTML = goodsItemResourceInnerHTML.replace('%goodsItemImg%', SRC_IMG + item.img);
            goodsItemResourceInnerHTML = goodsItemResourceInnerHTML.replace('%goodsItemLinkReplace%', item.id);
            goodsItemResourceInnerHTML = goodsItemResourceInnerHTML.replace('%goodsItemNameReplace%', item.name);
            goodsItemResourceInnerHTML = goodsItemResourceInnerHTML.replace('%goodsItemCostReplace%', item.costEU);

            newGoodsItem.innerHTML = goodsItemResourceInnerHTML;

            goods.appendChild(newGoodsItem);
        });
    };

    /**
     *
     * */
    var buildDetailsCard = function (hash) {
        var detailsCardOld = document.getElementById('detailsCard');
        if (detailsCardOld) {
            detailsCardOld.parentNode.removeChild(detailsCardOld);
        }

        var id = hash.replace('#', ''),
            detailItem = store.filter(function (item) {
                return item.id === id;
            })[0];

        var detailsCardResource = document.getElementById('detailsCardResource'),
            detailsCardResourceInnerHTML = detailsCardResource.innerHTML,
            newDetailsCard = document.createElement('section');

        newDetailsCard.className = 'c-details-card';
        newDetailsCard.id = 'detailsCard';

        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardTitleReplace%', detailItem.name);
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardImgReplace%', SRC_IMG + detailItem.img2);
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardDescDataSlideReplace%', detailItem.id);
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardDescCostEUReplace%', detailItem.costEU);
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardDescCostBRReplace%', detailItem.costBR);
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardDescDescReplace%', detailItem.desc);

        newDetailsCard.innerHTML = detailsCardResourceInnerHTML;

        detailsCardResource.parentNode.insertBefore(newDetailsCard, detailsCardResource);

        buildDetailsCardImgSlider(detailItem);
    };

    /**
     *
     * */
    var buildDetailsCardImgSlider = function (detailItem) {
        var detailsImgArr = detailItem.img3 ? detailItem.img3 : '';

        if (detailsImgArr.length) {
            var navSliderResource = document.getElementById('navSliderResource'),
                navImgSliderResource = document.getElementById('navImgSliderResource');

            detailsImgArr.forEach(function (item, i) {
                var navSliderItem =  document.createElement('li');

                navSliderItem.className = 'c-nav-slider-item';
                navSliderItem.setAttribute('data-slide', i);

                navSliderResource.appendChild(navSliderItem);

                var navImgSliderItem =  document.createElement('li');

                navImgSliderItem.className = 'c-nav-img-slider-item u-box-shadow u-bg-images--contain';
                navImgSliderItem.style.backgroundImage = 'url("' + SRC_IMG + item + '")';

                navImgSliderResource.appendChild(navImgSliderItem);
            });
        }
    };

    /**
     * Click on goods item
     * */
    var onChooseGoods = function () {
        var goods = document.getElementById('goods');

        goods.addEventListener('click', function (event) {
            event.preventDefault();
            var target = event.target;

            while (!target.hasAttribute('data-goods-link') || target !== goods) {
                if (target.hasAttribute('data-goods-link')) {
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
/**
 * Todo Active nav
 * */