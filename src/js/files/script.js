// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

window.onload = function () {
	document.addEventListener("click", documentActions);

	function documentActions(e) {
		const targetElement = e.target;

		if (targetElement.classList.contains('form-middle-header__icon')) {
			document.querySelector('.middle-header__container').classList.toggle('_active');
		} else if (!targetElement.closest('.middle-header__container') && document.querySelector('.form-middle-header._active')) {
			document.querySelector('.middle-header__container').classList.remove('_active');
		}

		if (targetElement.classList.contains('categories-form-header')) {
			document.querySelector('.categories-form-header').classList.toggle('_active');
		} else if (!targetElement.closest('.categories-form-header') && document.querySelector('.categories-form-header._active')) {
			document.querySelector('.categories-form-header').classList.remove('_active');
		}

		if (targetElement.classList.contains('language-top-header')) {
			document.querySelector('.language-top-header').classList.toggle('_active');
		} else if (!targetElement.closest('.language-top-header') && document.querySelector('.language-top-header._active')) {
			document.querySelector('.language-top-header').classList.remove('_active');
		}

		if (targetElement.classList.contains('product__shop')) {
			const productId = targetElement.closest('.product').dataset.pid;
			addToCart(targetElement, productId);
			e.preventDefault();
		}

		if (targetElement.classList.contains('cart-middle-header__icon') || targetElement.closest('.cart-middle-header__icon')) {
			if (document.querySelector('.cart-list').children.length > 0) {
				document.querySelector('.cart-middle-header').classList.toggle('_active-cart');
			}
			e.preventDefault();
		} else if (!targetElement.closest('.cart-middle-header') && !targetElement.classList.contains('product__shop')) {
			document.querySelector('.cart-middle-header').classList.remove('_active-cart');
		}

		if (targetElement.classList.contains('cart-list__delete')) {
			const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
			updateCart(targetElement, productId, false);
			e.preventDefault();
		}

		if (targetElement.classList.contains('products-main__item')) {
			document.querySelectorAll('.products-main__item').forEach(elem => {
				elem.classList.remove('_checked');
			})
			targetElement.classList.toggle('_checked');
			e.preventDefault();
		}

		if (targetElement.classList.contains('trending-main__item')) {
			document.querySelectorAll('.trending-main__item').forEach(elem => {
				elem.classList.remove('_checked');
			})
			targetElement.classList.toggle('_checked');
			e.preventDefault();
		}

	}

}

// AddToCart
function addToCart(productButton, productId) {
	if (!productButton.classList.contains('_hold')) {
		productButton.classList.add('_hold');
		productButton.classList.add('_fly');

		const cart = document.querySelector('.cart-middle-header__icon');
		const product = document.querySelector(`[data-pid="${productId}"]`);
		const productImage = product.querySelector('.product__image-ibg');

		const productImageFly = productImage.cloneNode(true);

		const productImageFlyWidth = productImage.offsetWidth;
		const productImageFlyHeight = productImage.offsetHeight;
		const productImageFlyTop = productImage.getBoundingClientRect().top;
		const productImageFlyLeft = productImage.getBoundingClientRect().left;

		productImageFly.setAttribute('class', '_flyImage-ibg');
		productImageFly.style.cssText =
			`
			left: ${productImageFlyLeft}px;
			top: ${productImageFlyTop}px;
			width: ${productImageFlyWidth}px;
			height: ${productImageFlyHeight}px;
		`;

		document.body.append(productImageFly);

		const cartFlyLeft = cart.getBoundingClientRect().left;
		const cartFlyTop = cart.getBoundingClientRect().top;

		productImageFly.style.cssText =
			`
			left: ${cartFlyLeft}px;
			top: ${cartFlyTop}px;
			width: 0px;
			height: 0px;
			opacity:0;
		`;

		productImageFly.addEventListener('transitionend', function () {
			if (productButton.classList.contains('_fly')) {
				productImageFly.remove();
				updateCart(productButton, productId);
				productButton.classList.remove('_fly');
			}
		});
	}
}

function updateCart(productButton, productId, productAdd = true) {
	const cart = document.querySelector('.cart-middle-header');
	const cartIcon = cart.querySelector('.cart-middle-header__icon');
	const cartQuantity = cartIcon.querySelector('span');
	const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
	const cartList = document.querySelector('.cart-list');

	//Добавляем
	if (productAdd) {
		if (cartQuantity) {
			cartQuantity.innerHTML = ++cartQuantity.innerHTML;
		} else {
			cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
		}
		if (!cartProduct) {
			const product = document.querySelector(`[data-pid="${productId}"]`);
			const cartProductImage = product.querySelector('.product__image-ibg').innerHTML;
			const cartProductTitle = product.querySelector('.product__title').innerHTML;
			const cartProductContent = `
			<a href="" class="cart-list__image-ibg">${cartProductImage}</a>
			<div class="cart-list__body">
				<a href="" class="cart-list__title">${cartProductTitle}</a>
				<div class="cart-list__quantity">Quantity: <span>1</span></div>
				<a href="" class="cart-list__delete">Delete</a>
			</div>`;
			cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
		} else {
			const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
			cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
		}

		// После всех действий
		productButton.classList.remove('_hold');
	} else {
		const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
		cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
		if (!parseInt(cartProductQuantity.innerHTML)) {
			cartProduct.remove();
		}

		const cartQuantityValue = --cartQuantity.innerHTML;

		if (cartQuantityValue) {
			cartQuantity.innerHTML = cartQuantityValue;
		} else {
			cartQuantity.remove();
			cart.classList.remove('_active');
		}
	}
}

function filterProducts() {
	const products = document.querySelector('.products-main')
	const trending = document.querySelector('.trending-main')

	const filterBox = products.querySelectorAll('.product');
	const filterTrend = trending.querySelectorAll('.product');

	document.querySelector('.products-main__list').addEventListener('click', event => {
		if (event.target.tagName !== "LI") return false;

		let filterClass = event.target.dataset['filter'];

		filterBox.forEach(elem => {
			elem.classList.remove('hide');
			if (!elem.classList.contains(filterClass) && filterClass !== "all") {
				elem.classList.add('hide');
			}
		})

	})

	document.querySelector('.trending-main__list').addEventListener('click', event => {
		if (event.target.tagName !== "LI") return false;

		let filterClass = event.target.dataset['filter'];


		filterTrend.forEach(elem => {
			elem.classList.remove('hide');
			if (!elem.classList.contains(filterClass) && filterClass !== "top") {
				elem.classList.add('hide');
			}
		})

	})
}

filterProducts();