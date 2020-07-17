'use strict'



const body = document.querySelector('body')
const modalAdd = document.querySelector('.modal__add');
const butonAdd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const сardModal = document.querySelector('.modal__item');
const catalog = document.querySelector('.catalog');
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const inputAddFoto = document.querySelector('.modal__file-input');
const btnAddFoto = document.querySelector('.modal__file-btn');
const imgAdd = document.querySelector('.modal__image-add');

const modalImageItem = document.querySelector('.modal__image-item');
const modalHeaderItem = document.querySelector('.modal__header-item');
const modalStatusItem = document.querySelector('.modal__status-item');
const modalDescriptionItem = document.querySelector('.modal__description-item');
const modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector('.search__input');
const menu = document.querySelector('.menu__container');


const textAddBtn = btnAddFoto.textContent;
const srcAddFoto = imgAdd.src;

const infoFoto = [];

const elemModalSubmit = [...modalSubmit.elements]
.filter(elem => elem.tagName !== 'BUTTON');

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

let counter = dataBase.length - 1;

// рендер карточки объявления
const renderCard = (DB = dataBase) => {
	catalog.textContent = '';

	DB.forEach(item =>{
		catalog.insertAdjacentHTML('beforeend', `
			<li class="card" data-id = "${item.id}">
				<img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
				<div class="card__description">
					<h3 class="card__header">${item.nameItem}</h3>
					<div class="card__price">${item.costItem} ₽</div>
				</div>
			</li>
		`)
	});
};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));


const checkForm = () => {
	const validForm = elemModalSubmit.every(elem => elem.value);
	modalBtnSubmit.disabled = !validForm;
	modalBtnWarning.style.display = validForm ? 'none' : '';
};


// сброс полей формы
const modalClose = event => {
	const target = event.target;

	if(target.closest('.modal__close') || target.classList.contains('modal') ||  event.key === 'Escape') {
		modalAdd.classList.add('hide');
		сardModal.classList.add('hide');
		body.removeEventListener('keydown', modalClose);
		modalSubmit.reset();
		btnAddFoto.textContent = textAddBtn;
		imgAdd.src = srcAddFoto;

		checkForm();
	}
};


//открываем модалку подачи объявления и просмотра объявления
butonAdd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.disabled = true;
	body.addEventListener('keydown', modalClose);
});

catalog.addEventListener('click', event => {
	const target = event.target;
	const card = target.closest('.card');

	if (card){
		const item = dataBase.find(obj=> obj.id == card.dataset.id);

		modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
		modalHeaderItem.textContent = item.nameItem;
		modalStatusItem.textContent = item.status;
		modalDescriptionItem.textContent = item.descriptionItem;
		modalCostItem.textContent = item.costItem;
		сardModal.classList.remove('hide');
		body.addEventListener('keydown', modalClose);
	}
});

// закрываем модалки
modalAdd.addEventListener('click', modalClose);

сardModal.addEventListener('click', modalClose);

modalSubmit.addEventListener('input', checkForm);


// сохраняем данные в локалсторадж
modalSubmit.addEventListener('submit', event => {
	event.preventDefault();
	const itemObj = {};

	for(const elem of elemModalSubmit){
		itemObj[elem.name] = elem.value;
	}

	itemObj.id = counter++;
	itemObj.image = infoFoto.base64;
	dataBase.push(itemObj);
	modalSubmit.reset();
	modalClose({target: modalAdd});
	saveDB();
	renderCard();
});

// загружаем фото в модалку подачи объявления.
inputAddFoto.addEventListener('change', event => {
	const target = event.target;
	

	const reader = new FileReader();
	

	const file = target.files[0];
	;

	infoFoto.filename = file.name;
	console.log(infoFoto.filename);
	infoFoto.size = file.size;

	reader.readAsBinaryString(file);
	reader.addEventListener('load', event => {
		if(infoFoto.size < 300000) {
			btnAddFoto.textContent = infoFoto.filename;
			infoFoto.base64 = btoa(event.target.result);
			imgAdd.src = `data:image/jpeg;base64,${infoFoto.base64}`;
			console.log(imgAdd.src)
		} else {
			btnAddFoto.textContent = 'Файл не должен превышать 300кб';
			inputAddFoto.value = '';
			checkForm();
		}
		
	})
});

// настраиваем поиск
searchInput.addEventListener('input', () => {
	const valueSearch = searchInput.value.trim().toLowerCase();

	if(valueSearch.length > 2){
		const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch));
		renderCard(result);
	}
});

// настраиваем меню
menu.addEventListener('click', event => {
	const target = event.target;

	if(target.tagName === 'A'){
		const result = dataBase.filter(item => item.category === target.dataset.category);
		renderCard(result);
	}
})

renderCard();