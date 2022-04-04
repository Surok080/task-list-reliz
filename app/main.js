let user;
let task;
let date = new Date();
let counBtn = 0;
let taskThis = '';
let flag = true;



//Получение списка людей
let userF = new Promise((resolve, reject) => {
	fetch(`https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users?limit=15`)
		.then(data => {
			resolve(data.json());
		})
});

//Получение списка задач
let taskF = new Promise((resolve, reject) => {
	fetch(`https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks`)
		.then(data => {
			resolve(data.json());
		})
});

//Ожидание ответа
Promise.all([taskF, userF]).then(data => {
	//присвоение перенной массива с задачами
	task = data[0];
	// console.log(task);
	//присвоение перенной массива с списком людей
	user = data[1];
	//Выключение загрузочной заставки
	loadEnd();

	//Создание блока юзера с атрибутом Дата = юзер нейм, в этом блоке создается 2 блока (блок ФИО юзера и блока задач Юзера)
	creatUserDiv();

	//Нивелирование скролл барра отрицательным отступом
	clearScrollBar('.user-task');
	clearScrollBar('.backlog__task-list');

	//Добавление блоков задач на каждый день недели, с АйДи соотвествующего работника
	createTaskData();

	//Отображение текущей даты в соотвествующих блоках
	genegateData();

	//Создание задач, если нет исполнителя, тогда задача перемещается в БэкЛогЛист, если исполнитель есть, тогда в соотвествии с датой начала и датой окончания ставится в задачи конкретного исполнителя на конкретную дату
	createTaskBack();

	//Функция драг энд дроп
	dragAndDrop();
});

//Функция прелистывания даты(левая копка перелистывающая на неделю назад)
function leftBtn() {
	counBtn += 7;

	//Удаляет все задачи
	delTask();

	creatUserDiv()

	//Добавление блоков задач на каждый день недели, с АйДи соотвествующего работника
	createTaskData();

	//Создаюет новые даты но со смещением на 7 дней назад
	genegateData(counBtn);

	//Создаются снова задачи но уже на текующе (обновленные даты)
	createTaskBack();

	//Функция драг энд дроп
	dragAndDrop();
};

//Вызов функции перелистывания недель 
document.querySelectorAll('.button-nav')[0].onclick = leftBtn;


//Функция прелистывания даты(центральная кнопка для возврата в текущую дату)
function centerBtn() {
	counBtn = 0;

	//Удаляет все задачи
	delTask();

	creatUserDiv()

	//Добавление блоков задач на каждый день недели, с АйДи соотвествующего работника
	createTaskData();

	//Создаюет новые даты но со смещением на 7 дней назад
	genegateData(counBtn);

	//Создаются снова задачи но уже на текующе (обновленные даты)
	createTaskBack();

	//Функция драг энд дроп
	dragAndDrop();
};



//Вызов функции перелистывания недель 
document.querySelectorAll('.button-nav')[1].onclick = centerBtn;


//Функция прелистывания даты(правая копка перелистывающая на неделю вперед)
function rigthBtn() {
	counBtn -= 7;

	//Удаляет все задачи
	delTask();

	creatUserDiv()

	//Добавление блоков задач на каждый день недели, с АйДи соотвествующего работника
	createTaskData();

	//Создаюет новые даты но со смещением на 7 дней назад
	genegateData(counBtn);

	//Создаются снова задачи но уже на текующе (обновленные даты)
	createTaskBack();

	//Функция драг энд дроп
	dragAndDrop();
};

//Функция вызова бургер меню
function burger() {
	if (flag) {
		document.querySelector('.backlog').style.display = 'block';
		flag = false;
	} else {
		document.querySelector('.backlog').style.display = 'none';
		flag = true;
	}
	this.classList.toggle("active");
}


//Обработчик событий при нажатии на кнопку бургер меню
document.querySelector('.button__burger').onclick = burger;

//Вызов функции перелистывания недель 
document.querySelectorAll('.button-nav')[2].onclick = rigthBtn;

//Функция завершения загрузки
function loadEnd() {
	document.querySelector('.load').style.display = 'none';
};

//Создание блока юзера с атрибутом Дата = юзер нейм, в этом блоке создается 2 блока (блок ФИО юзера и блока задач Юзера)
function creatUserDiv() {
	for (let i = 0; i < user.length; i++) {
		let divUser = document.createElement('div');
		divUser.className = "user-1";

		//добавление атрибута Дата с Юзер неймом для каждого созданного блока юзера
		divUser.setAttribute('data', user[i].username);

		//Создание внутри блока юзера 2 блока (1- блок с ФИО юзером, 2- блок под задачи юезра на каждый день недели)
		divUser.draggable = true;
		divUser.innerHTML = `<div class="name-user">${user[i].surname} ${user[i].firstName}</div><div class="task-user"></div>`;
		document.querySelector('.user-task').append(divUser);
	}
}

//Функция создание блоков для заданий на каждый день недели с атрибутом АйДи исполнителя и текущей даты соотвествующего дня недели
function createTaskData() {
	for (let z = 0; z < 7; z++) {
		for (let i = 0; i < user.length; i++) {
			let divData = document.createElement('div');
			divData.className = "task-user-data";
			divData.setAttribute('data-id', user[i].id);
			document.querySelectorAll('.user-1')[i].lastElementChild.append(divData);
		}
	}
}

//функция отображение текущей даты в соотвествующих блоках
function genegateData(x = 0) {
	date = new Date();
	date.setDate(date.getDate() - x);
	let k = 0;
	for (let i = 0; i < 7; i++) {
		date.setDate(date.getDate() - (((date.getDay() + k) - 1) - i));
		document.querySelector(`.data-${i}`).innerHTML = date.toISOString().slice(0, 10);

		//Вызов функции добавляющий атрибут Дата с значением текущей даты
		atributeTask(date.toISOString().slice(0, 10), i);
	}
	let nowDate = document.querySelectorAll('.button-nav');
	nowDate.forEach(elem => {
		if (elem.innerHTML == 'Текущая дата:') {
			elem.innerHTML += ` ${date.toISOString().slice(0, 10)}`;
		}
	});
}

//Вызов функции добавляющий атрибут Дата с значением текущей даты
function atributeTask(data, z) {
	for (let i = 0; i < user.length; i++) {
		let div = document.querySelectorAll('.task-user')[i].children[z];
		//Добавляем в каждый день недели для каждого исполнителя атрибут текущей даты
		div.setAttribute('data', data);
	}
}


//Создание задач, если нет исполнителя, тогда задача перемещается в БэкЛогЛист, если исполнитель есть, тогда в соотвествии с датой начала и датой окончания ставится в задачи конкретного исполнителя на конкретную дату
function createTaskBack() {
	for (let i = 0; i < task.length; i++) {
		//Проверка есть ли у задачи исполнитель
		if (task[i].executor > 0) {

			//Вызов функции добавления начала задачи в заданный день старта с необходимой информацией
			//Передавайемые параметры текущей задачи(Испольнитель, дата задачи, название задачи, дата начала задачи, дата окончания задачи, айди задачи)
			searchUserEx(task[i].executor, task[i].planStartDate, task[i].subject, task[i].planStartDate, task[i].planEndDate, task[i].id);

			//Вызов функции добавления конца задачи в заданный день окончания с необходимой информацией
			//Передавайемые параметры текущей задачи(Испольнитель, дата задачи, название задачи, дата начала задачи, дата окончания задачи, айди задачи)
			searchUserEx(task[i].executor, task[i].planEndDate, task[i].subject, task[i].planStartDate, task[i].planEndDate, task[i].id, 'bg-red');

			//Если исполнителя нет, тогда задача падает в БэкЛогЛист
		} else {
			let divTask = document.createElement('div');
			divTask.className = "backlog__task";
			divTask.id = task[i].id;
			divTask.draggable = true;
			divTask.innerHTML = `<div class="backlog__task-title">${task[i].subject}</div>`;
			document.querySelector('.backlog__task-list').append(divTask);
		}
	}

}

//Поиск есть ли у задач параметр executor совпадающий с айди пользователей, в случае совпадении добавляется задача данному пользователю в соотвествующую дату 
function searchUserEx(exec, data, subject, startDate, endDate, id, bg = 'bg-green') {
	// -------------------------------------------------------
	// Задел на добавления функции отображения продолжения задачи (блок задачи будет отображаться не только в день старта и окончания но и на протяжении всего переода выделенного под задачу)
	let data2 = new Date(startDate)
	let data1 = new Date(endDate)
	let k = (1000 * 60 * 60 * 24);
	let sumday = (data1 - data2) / k;
	let a = new Date(data)
	a.setDate(a.getDate() + 2); // это как прибавлять дни
	// console.log(a.toISOString().slice(0, 10));
	// -------------------------------------------------------


	let nawDay = new Date();
	let endDay = new Date(endDate);
	for (let i = 0; i < user.length; i++) {
		if (user[i].id == exec) {
			let task = document.querySelectorAll('.user-1')[i].lastElementChild;
			for (let z = 0; z < 7; z++) {
				if (task.children[z].getAttribute('data') == data) {
					let divTask = document.createElement('div');
					if (nawDay >= endDay && bg == 'bg-red') {
						divTask.className = `task-1 redG`;
					} else {
						divTask.className = `task-1 ${bg}`;
					}
					divTask.id = `${id}`;
					divTask.draggable = true;
					divTask.innerHTML = `${subject}<span>Дата начала: ${startDate}<br><hr>Дата выполнения: ${endDate}<br><hr>${id}</span>`;
					task.children[z].append(divTask);
				}
			}
		}
	}
}

//Функция удаления задач у юзера и задач в бэклисте
function delTask() {
	// удаление задач у юзеров
	let task = document.querySelectorAll('.task-1');
	for (let i = 0; i < task.length; i++) {
		task[i].remove();
	}
	// удаление списка пользователей в выпадающем списке модального окна
	let optionSelect = document.querySelectorAll('option');
	for (let i = 0; i < optionSelect.length; i++) {
		optionSelect[i].remove();
	}
	// удаление всего что есть в поле даты пользователя
	let taskUser = document.querySelectorAll('.task-user-data');
	for (let i = 0; i < taskUser.length; i++) {
		taskUser[i].remove();
	}

	//удаление в бэклисте
	let count = document.querySelectorAll('.backlog__task');
	for (let i = 0; i < count.length; i++) {
		count[i].remove();
	}

	// удаление всей строки пользователя (пользователя, полей каждого дня недели)
	let userOne = document.querySelectorAll('.user-1');
	for (let i = 0; i < userOne.length; i++) {
		userOne[i].remove();
	}
}

//Добавление отрицательного марджина для нивелирование ширины скроллбара
function clearScrollBar(out) {
	let div = document.querySelector(out);
	div.style.marginRight = `${-(div.offsetWidth - div.clientWidth)}px`;
}


//функция драг энд дроп
const dragAndDrop = () => {
	let taskItem = document.querySelectorAll('.backlog__task');
	let taskCell = document.querySelectorAll('.task-user-data');
	let taskUser = document.querySelectorAll('.task-1');
	let taskDel = document.querySelector('.backlog__task-list');
	let userBlock = document.querySelectorAll('.name-user');


	function dragStart() {
		taskThis = this;
		setTimeout(() => {
			this.classList.add('hide')
		}, 0);
	}

	function dragEnd() {
		this.classList.remove('hide');
	}

	const dragOver = function (event) {
		event.preventDefault();
	}

	const dragEnter = function () {
		this.classList.add('bg-item');
	}

	const dragLeave = function () {
		this.classList.remove('bg-item');
	}

	function dragDrop() {
		this.classList.remove('bg-item');

		task.forEach(elem => {
			if (elem.id == taskThis.id) {

				//Присваиваем исполнителя перетаскиваемой задаче
				elem.executor = +this.getAttribute('data-id');

				//Определяем сколько дней между стартом и ендом таска
				let data2 = new Date(elem.planStartDate)
				let data1 = new Date(elem.planEndDate)
				let k = (1000 * 60 * 60 * 24);
				let sumday = (data1 - data2) / k; //кол-во дней


				//Переводим в числовой массив дату указанную в блоке
				let thisData = this.getAttribute('data').split('-').map(string => +string);

				//Получаем текущую дату
				newDataStart = new Date(thisData[0], thisData[1] - 1, thisData[2] + 1); //дата дня куда перетащили таск
				newDataEnd = new Date(thisData[0], thisData[1] - 1, thisData[2] + sumday + 1); //дата окончания таска

				elem.planStartDate = newDataStart.toISOString().slice(0, 10);
				elem.planEndDate = newDataEnd.toISOString().slice(0, 10);

				//Удаляет все задачи
				delTask();

				creatUserDiv()

				//Добавление блоков задач на каждый день недели, с АйДи соотвествующего работника
				createTaskData();

				//Создаюет новые даты но со смещением на 7 дней назад
				genegateData(counBtn);

				//Создаются снова задачи но уже на текующе (обновленные даты)
				createTaskBack();

				//Функция драг энд дроп
				dragAndDrop();
			}
		})
	}


	function dragEndTouch() {
		taskThis = this;
		document.querySelector('.popup').style.opacity = 1;
		document.querySelector('.popup').style.visibility = 'visible';
		document.querySelector('.modal__fons').style.display = 'block';
		document.querySelector('.backlog').style.display = 'none';

		for (let i = 0; i < user.length; i++) {
			let userSelect = document.createElement('option');
			userSelect.value = `${user[i].id}`;
			if (this.textContent == `${user[i].surname} ${user[i].firstName}`) {
				userSelect.selected = true;

				for (let k = 0; k < task.length; k++) {
					if (taskThis.id == task[k].id) {
						task[k].executor = user[i].id;
					}
				}
			}
			userSelect.innerHTML = `${user[i].surname} ${user[i].firstName}`;
			document.getElementById('user').append(userSelect);
		}
	}


	const dragDropDel = function () {
		task.forEach(elem => {
			if (elem.id == taskThis.id) {
				elem.executor = '';
			};
		});

		//Удаляет все задачи
		delTask();

		creatUserDiv()

		//Добавление блоков задач на каждый день недели, с АйДи соотвествующего работника
		createTaskData();

		//Создаюет новые даты
		genegateData(counBtn);

		//Создаются снова задачи но уже на текующе (обновленные даты)
		createTaskBack();

		//Функция драг энд дроп
		dragAndDrop();
	}

	function dragDropUser() {
		this.classList.remove('bg-item');
		document.querySelector('.popup').style.opacity = 1;
		document.querySelector('.popup').style.visibility = 'visible';
		document.querySelector('.modal__fons').style.display = 'block';
		document.querySelector('.backlog').style.display = 'none';

		for (let i = 0; i < user.length; i++) {
			let userSelect = document.createElement('option');
			userSelect.value = `${user[i].id}`;
			if (this.textContent == `${user[i].surname} ${user[i].firstName}`) {
				userSelect.selected = true;
				for (let k = 0; k < task.length; k++) {
					if (taskThis.id == task[k].id) {
						task[k].executor = user[i].id;
					}
				}
			}
			userSelect.innerHTML = `${user[i].surname} ${user[i].firstName}`;
			document.getElementById('user').append(userSelect);
		}
	}

	//Обработчики событий
	document.querySelector('.popup__close').onclick = closePopup;
	document.querySelector('.close').onclick = closePopup;

	taskDel.addEventListener('dragover', dragOver);
	taskDel.addEventListener('drop', dragDropDel);

	taskCell.forEach(elemCell => {
		elemCell.addEventListener('dragover', dragOver);
		elemCell.addEventListener('dragenter', dragEnter);
		elemCell.addEventListener('dragleave', dragLeave);
		elemCell.addEventListener('drop', dragDrop);
	});

	userBlock.forEach(elemBlock => {
		elemBlock.addEventListener('dragover', dragOver);
		elemBlock.addEventListener('dragenter', dragEnter);
		elemBlock.addEventListener('dragleave', dragLeave);
		elemBlock.addEventListener('drop', dragDropUser);
	});

	taskUser.forEach(elemUser => {
		elemUser.addEventListener('dragstart', dragStart);
		elemUser.addEventListener('dragend', dragEnd);
	});

	taskItem.forEach(elemItem => {
		elemItem.addEventListener('click', dragEndTouch);
		elemItem.addEventListener('touchend', dragEndTouch);
		elemItem.addEventListener('dragstart', dragStart);
		elemItem.addEventListener('dragend', dragEnd);
	});
}

//Функция закрытия модального окна
function closePopup() {
	document.querySelector('.popup').style.opacity = 0;
	document.querySelector('.popup').style.visibility = 'hidden';
	document.querySelector('.modal__fons').style.display = 'none';
	document.querySelector('.backlog').style.display = 'block';
}

//Функция считывания и обработки данных модального окна
function userTaskPopup() {
	let startDate = document.getElementById('startTask').value;
	let endDate = document.getElementById('endTask').value;
	let userOption = document.getElementById('user');
	let dateStart = new Date(startDate);
	let dateEnd = new Date(endDate);

	if (dateStart > dateEnd) {
		alert('Даты не верные');
	} else {
		task.forEach(elem => {
			if (elem.id == taskThis.id) {
				user.forEach(element => {
					if (userOption.options[userOption.selectedIndex].textContent == `${element.surname} ${element.firstName}`) {
						elem.executor = element.id;
					}
				});

				if (startDate != '') {
					elem.planStartDate = startDate;
				} else if (endDate != '') {
					elem.planEndDate = endDate;
				} 

				
				

				//Удаляет все задачи
				delTask();

				creatUserDiv()

				//Добавление блоков задач на каждый день недели, с АйДи соотвествующего работника
				createTaskData();

				//Создаюет новые даты но со смещением на 7 дней назад
				genegateData(counBtn);

				//Создаются снова задачи но уже на текующе (обновленные даты)
				createTaskBack();

				//Функция драг энд дроп
				dragAndDrop();
			}
		})
		closePopup();
	}
}
