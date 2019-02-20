window.addEventListener('DOMContentLoaded', () => {
// Работа с базой данных
    const loadContent = async (url, callback) => {
        await fetch(url)
            .then(response => response.json())
            .then(json => createElement(json.goods));

        callback();
    };

    function createElement(arr) {
        const goodsWrapper = document.querySelector('.goods__wrapper');

        arr.forEach(function(item) {
            let card = document.createElement('div');
            card.classList.add('goods__item');
            card.innerHTML = `
                <img class="goods__img" src="${item.url}" alt="phone">
                <div class="goods__colors">Доступно цветов: 4</div>
                <div class="goods__title">
                    ${item.title}
                </div>
                <div class="goods__price">
                    <span>${item.price}</span> руб
                </div>
                <button class="goods__favorite">В избранное</button>
                <button class="goods__btn">Добавить в корзину</button>
            `;
            goodsWrapper.appendChild(card);
        });
    }

    loadContent('js/db.json', () => {

    // Переменные
        const favorWrapper = document.querySelector('.favorite__wrapper'),
            cartWrapper = document.querySelector('.cart__wrapper'),
            favorite = document.querySelector('.favorite'),
            closefavorite = document.querySelector('.favorite__close'),
            openfavorite = document.querySelector('#favorite'),
            cart = document.querySelector('.cart'),
            close = document.querySelector('.cart__close'),
            open = document.querySelector('#cart'),
            goodsFavorite = document.querySelectorAll('.goods__favorite'),
            goodsBtn = document.querySelectorAll('.goods__btn'),
            products = document.querySelectorAll('.goods__item'),
            confirm = document.querySelector('.confirm'),
            badgefavor = document.querySelector('.nav__badge__favor'),
            badge = document.querySelector('.nav__badge'),
            totalCost = document.querySelector('.cart__total > span'),
            titles = document.querySelectorAll('.goods__title');

// Favorite Module -------------------------------------------
    // Открытие|закрытие окна избранных
    function openFavorite() {
        favorite.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function closeFavorite() {
        favorite.style.display = 'none';
        document.body.style.overflow = '';
    }
    openfavorite.addEventListener('click', openFavorite);
    closefavorite.addEventListener('click', closeFavorite);

    
    // Добавление товара в избранные
    goodsFavorite.forEach(function (favor, i) {
        favor.addEventListener('click', () => {
            let itemfavor = products[i].cloneNode(true),
                trigger = itemfavor.querySelector('button'),
                removeBtnFavor = document.createElement('div'),
                empty = favorWrapper.querySelector('.empty');
            trigger.remove();

            removeBtnFavor.classList.add('goods__item-remove');
            removeBtnFavor.innerHTML = '&times';
            itemfavor.appendChild(removeBtnFavor);

            favorWrapper.appendChild(itemfavor);
            if (empty) {
                empty.style.display = 'none';
            }

            calcFavorite();
            removeFromFavorite();
        });
    });

    // Счетчик к-ва товаров в избранном    
    function calcFavorite() {
        const items = favorWrapper.querySelectorAll('.goods__item');
        badgefavor.textContent = items.length;

        let empty = favorWrapper.querySelector('.empty');
        if (badgefavor.textContent < 1) {
            empty.style.display = 'block';
        }
    }

    // Удаление товара из избранных    
    function removeFromFavorite() {
        const removeBtnFavor = favorite.querySelectorAll('.goods__item-remove');
        removeBtnFavor.forEach(function (favor) {
            favor.addEventListener('click', () => {
                favor.parentElement.remove();

                calcFavorite();
            });
        });
    }

// Cart Module -------------------------------------------
    // Открытие|закрытие окна корзины
        function openCart() {
            cart.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        function closeCart() {
            cart.style.display = 'none';
            document.body.style.overflow = '';
        }
        open.addEventListener('click', openCart);
        close.addEventListener('click', closeCart);

    // Добавление товара в корзину
        goodsBtn.forEach(function (btn, i) {
            btn.addEventListener('click', () => {
                let item = products[i].cloneNode(true),
                    trigger = item.querySelector('button'),
                    removeBtn = document.createElement('div'),
                    empty = cartWrapper.querySelector('.empty');
                trigger.remove();

                showConfirm();

                removeBtn.classList.add('goods__item-remove');
                removeBtn.innerHTML = '&times';
                item.appendChild(removeBtn);

                cartWrapper.appendChild(item);
                if (empty) {
                    empty.style.display = 'none';
                }

                calcGoods();
                calcTotal();
                removeFromCart();
            });
        });

    // Ограничение символов в описании товара
        function sliceTitle() {
            titles.forEach(function (item) {
                if (item.textContent.length < 70) {
                    return;
                } else {
                    const str = item.textContent.slice(0, 71) + '...';
                    item.textContent = str;
                }
            });
        }
        sliceTitle();

    // Анимация добавления товара в корзину   
        function showConfirm() {
            confirm.style.display = 'block';
            let counter = 100;
            const id = setInterval(frame, 10);

            function frame() {
                if (counter == 10) {
                    clearInterval(id);
                    confirm.style.display = 'none';
                } else {
                    counter--;
                    confirm.style.transform = `translateY(-${counter}px)`;
                    confirm.style.opacity = '.' + counter;
                }
            }
        }

    // Счетчик к-ва товаров в корзине    
        function calcGoods() {
            const items = cartWrapper.querySelectorAll('.goods__item');
            badge.textContent = items.length;

            let empty = cartWrapper.querySelector('.empty');
            if (badge.textContent < 1) {
                empty.style.display = 'block';
            }
        }

    // Суммирование общей  товаров в корзине    
        function calcTotal() {
            const prices = document.querySelectorAll('.cart__wrapper > .goods__item > .goods__price > span');
            let total = 0;
            prices.forEach(function (item) {
                total += +item.textContent;
            });
            totalCost.textContent = total;
        }

    // Удаление товара из корзины    
        function removeFromCart() {
            const removeBtn = cart.querySelectorAll('.goods__item-remove');
            removeBtn.forEach(function (btn) {
                btn.addEventListener('click', () => {
                    btn.parentElement.remove();

                    calcGoods();
                    calcTotal();
                });
            });
        }

    });
});