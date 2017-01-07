'use strict';

var app = (function () {
    /**
     * Constants
     * */
    var AJAX_HEADERS = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic cnN0eWxlbGFiOlJzdHlCbG87bTM5'
        },
        FILE_NAME_LOADER = 'loader.svg',
        SRC_IMG = 'images/',
        URL_DATA = 'https://bloombees.com/h/api/manage/',
        URL_DATA_PRODUCTS = URL_DATA + 'products/',
        URL_DATA_PICTURES = URL_DATA + 'pictures/';

    /**
     * Private variables
     * */
    var store,
        lastIndexGoodsItem = 0;

    /**
     * Save data products
     * */
    var saveDataProducts = function (response) {
        var documentWidth = document.documentElement.clientWidth,
            countItems = 12;

        if (documentWidth >= 480 && documentWidth < 768) {
            countItems = 8;
        } else if (documentWidth < 480) {
            countItems = 4;
        }

        store = JSON.parse(response).data;

        store.forEach(function (item) {
            item.Product_pictures = [];
        });

        buildGoods(store, lastIndexGoodsItem, countItems);
    };

    /**
     * Build goods
     * */
    var buildGoods = function (data, startIndexItem, countItems) {
        var goods = document.getElementById('goods'),
            hash = window.location.hash,
            id = hash.replace('#', '');

        if (startIndexItem >= data.length) {
            window.removeEventListener('wheel', lazyLoadLoader);
            window.removeEventListener('touchend', lazyLoadLoader);
        }

        if (id) {
            var detailItem = data.filter(function (item) {
                return item.Product_id === id;
            })[0];

            ajaxGet(URL_DATA_PICTURES + detailItem.Product_storeId + '/' + id, function (response) {
                var images = JSON.parse(response).data;

                data.forEach(function (item) {
                    if (item.Product_id === id) {
                        item.Product_pictures = images.map(function (subitem) {
                            return subitem.Picture_sourceUrl;
                        });
                    }
                });

                var image = new Image();
                image.addEventListener('load', function () {
                    buildDetailsCard(hash);
                });
                image.src = images[0].Picture_sourceUrl;
            });
        }

        data.forEach(function (item, i) {
            if (i >= startIndexItem && i < startIndexItem + countItems) {
                var goodsItemResourceInnerHTML = document.getElementById('goodsItemResource').innerHTML,
                    newGoodsItem = document.createElement('li');

                ajaxGet(URL_DATA_PICTURES + item.Product_storeId + '/' + item.Product_id, function (response) {
                    var images = JSON.parse(response).data;

                    item.Product_pictures = images.map(function (subitem) {
                        return subitem.Picture_sourceUrl;
                    });

                    newGoodsItem.className = 'c-goods--item u-box-shadow u-animation--fade-in';
                    newGoodsItem.setAttribute('data-goods-item', '');

                    var image = new Image();
                    image.addEventListener('load', function () {
                        var goodsItem = document.querySelector('[data-goods-img="' + item.Product_id + '"]');

                        goodsItem.style.backgroundImage = 'url("' + item.Product_pictures[0] + '")';
                    });
                    image.src = item.Product_pictures[0];

                    goodsItemResourceInnerHTML = goodsItemResourceInnerHTML.replace(/(%goodsItemLinkReplace%)/g, item.Product_id);
                    goodsItemResourceInnerHTML = goodsItemResourceInnerHTML.replace('%goodsItemNameReplace%', item.Product_name);
                    goodsItemResourceInnerHTML = goodsItemResourceInnerHTML.replace('%goodsItemCostReplace%', item.Product_price + ' €');

                    newGoodsItem.innerHTML = goodsItemResourceInnerHTML;

                    goods.appendChild(newGoodsItem);
                });
            }
        });

        lastIndexGoodsItem += countItems - 1;
    };

    /**
     * Build details card
     * */
    var buildDetailsCard = function (hash) {
        var detailsCardOld = document.getElementById('detailsCard');
        if (detailsCardOld) {
            detailsCardOld.parentNode.removeChild(detailsCardOld);
        }

        var id = hash.replace('#', ''),
            detailItem = store.filter(function (item) {
                return item.Product_id === id;
            })[0];

        var detailsCardResource = document.getElementById('detailsCardResource'),
            detailsCardResourceInnerHTML = detailsCardResource.innerHTML,
            newDetailsCard = document.createElement('section');

        newDetailsCard.className = 'c-details-card';
        newDetailsCard.id = 'detailsCard';

        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardTitleReplace%', detailItem.Product_name);
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardImgReplace%', detailItem.Product_pictures[0]);
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardDescDataSlideReplace%', detailItem.Product_id);
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardDescCostEUReplace%', detailItem.Product_price + ' €');
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardDescCostBRReplace%', detailItem.Product_price + ' BYR');
        detailsCardResourceInnerHTML = detailsCardResourceInnerHTML.replace('%detailsCardDescDescReplace%', detailItem.Product_description);

        newDetailsCard.innerHTML = detailsCardResourceInnerHTML;

        detailsCardResource.parentNode.insertBefore(newDetailsCard, detailsCardResource);

        buildDetailsCardImgSlider(detailItem);
        onChangeSliderItem(detailItem);
    };

    /**
     * Build details card image slider
     * */
    var buildDetailsCardImgSlider = function (detailItem) {
        var detailsImages = detailItem.Product_pictures ? detailItem.Product_pictures : '';

        if (detailsImages.length > 1) {
            var navSliderResource = document.getElementById('navSliderResource'),
                navImgSliderResource = document.getElementById('navImgSliderResource');

            detailsImages.forEach(function (item, i) {
                /**
                 * Slider navigation
                 * */
                var navSliderItem =  document.createElement('li');

                navSliderItem.className = i === 0 ? 'c-nav-slider--item active' : 'c-nav-slider--item';
                navSliderItem.setAttribute('data-slide', i);

                navSliderResource.appendChild(navSliderItem);

                /**
                 * Slider image navigation
                 * */
                var image = new Image();
                image.addEventListener('load', function () {
                    navImgSliderItem.style.backgroundImage = 'url("' + item + '")';
                });
                image.src = item;

                var navImgSliderItem =  document.createElement('li');

                navImgSliderItem.className = i === 0 ?
                    'c-nav-img-slider--item u-box-shadow u-bg-images--contain active' :
                    'c-nav-img-slider--item u-box-shadow u-bg-images--contain';
                navImgSliderItem.setAttribute('data-slide', i);
                navImgSliderItem.style.backgroundImage = 'url("' + SRC_IMG + FILE_NAME_LOADER + '")';

                navImgSliderResource.appendChild(navImgSliderItem);
            });
        }
    };

    /**
     * Lazy load loader
     * */
    var lazyLoadLoader = function () {
        var documentHeight = document.documentElement.clientHeight,
            lastGoodsItem = document.querySelector('[data-goods-item]:last-child'),
            lastGoodsItemBottom = lastGoodsItem.getBoundingClientRect().bottom;

        if (lastGoodsItemBottom < documentHeight) {
            buildGoods(store, lastIndexGoodsItem, 4);
        }
    };

    /**
     * Lazy load
     * */
    var lazyLoad = function () {
        window.addEventListener('wheel', lazyLoadLoader);
        window.addEventListener('touchend', lazyLoadLoader);
    };

    /**
     * Change slider item
     * */
    var onChangeSliderItem = function (detailItem) {
        var detailsCard = document.getElementById('detailsCard');

        detailsCard.addEventListener('click', function (event) {
            event.preventDefault();
            var target = event.target;

            while (!target.hasAttribute('data-slide') || target !== detailsCard) {
                if (target.hasAttribute('data-slide')) {
                    var slideNumber = +target.getAttribute('data-slide'),
                        detailsCardImg = document.getElementById('detailsCardImg');

                    detailsCardImg.style.backgroundImage = 'url("' + detailItem.Product_pictures[slideNumber] + '")';

                    var navSliderAll = document.querySelectorAll('[data-slide]');
                    Array.prototype.forEach.call(navSliderAll, function (item) {
                        var itemNumber = +item.getAttribute('data-slide');

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
        });
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

    /**
     * Ajax GET
     * */
    var ajaxGet = function (url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        for(var key in AJAX_HEADERS) {
            xhr.setRequestHeader(key, AJAX_HEADERS[key]);
        }

        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                console.error('Data loading error.\n' + xhr.status + ': ' + xhr.statusText);
            } else {
                callback(xhr.responseText);
            }
        };
    };

    return {
        /**
         * Get data
         * */
        getData: function () {
            ajaxGet(URL_DATA_PRODUCTS, saveDataProducts);
        },

        /**
         * Initialization
         * */
        init: function () {
            onChooseGoods();
            onPopState();
            app.getData();
            lazyLoad();
        }
    }
})();

/**
 * Dom ready
 * */
document.addEventListener('DOMContentLoaded', app.init);