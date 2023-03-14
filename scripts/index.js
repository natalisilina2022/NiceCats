  
const boxForCards = document.querySelector('main');

const addBtn = document.querySelector("#add");
const popupForm = document.querySelector("#popup-form");
const closePopupForm = popupForm.querySelector(".popup-close");
const enterBtn = document.querySelector("#enter");
const authorizForm = document.querySelector("#authoriz-form");
const closeAuthorizForm = authorizForm.querySelector(".authoriz-close");
const detInfoForm = document.querySelector("#det_info-form");
const closeDetInfoForm = detInfoForm.querySelector(".det_info-close");
const enterForm = document.querySelector('.authorizForm');
const delButton = document.querySelector('.del')
const changeButton = document.querySelector('.change')
const showInfo = document.querySelector('.show-info')
const form = document.querySelector('.add_pet');
let activeIndex
let activeName

const api = new Api("natalisilina");

const getCat = async (api) => {
    try {
        const reqType = await api.getCats()
        const response = await reqType.json()
        if (response.message === 'ok') {
            const cats = await response.data
            if (localStorage.length === 0) {
                renderCards(cats)
                localStorage.setItem("cats", JSON.stringify(cats))
            }
            localStorage.setItem("cats", JSON.stringify(cats))
        }
    } catch (err) {
        console.log("Error be patient, We working on it");
    }
}
getCat(api)

let catsArr = (localStorage.getItem('cats') && JSON.parse(localStorage.getItem('cats'))) || []

function serializeForm(formNode) {
    const objToSend = {}
    const formControl = formNode.elements
    const formArr = Array.from(formControl)
    formArr.forEach((el) => {
        if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
            if (el.value !== '' && el.type !== 'checkbox') {
                objToSend[el.name] = el.value
            } else if (el.value !== '' && el.type === 'checkbox') {
                objToSend[el.name] = el.checked
            }
        }
    })
    return objToSend
}

function modifyObj(catsArr, activeIndex, modObj) {
    return catsArr.map(element => {
        if (element.id === activeIndex) {
            return {
                ...element,
                ...modObj
            }
        }
        return element
    })
}

function addCard(cat) {
    const card = document.createElement('div')
    card.id = `${cat.id}`
    card.className = `${cat.favourite ? 'card like' : 'card disLike'}`
    card.innerHTML = `<span>${cat.name}</span>`
    boxForCards.appendChild(card)
    const width = card.offsetWidth
    card.style.height = width * 0.6 + "px"
    card.style.backgroundImage = `url(${cat.img_link})`
    card.addEventListener('click', (e) => {
        activeIndex = cat.id
        activeName = cat.name
        if (!detInfoForm.classList.contains("active")) {
            detInfoForm.classList.add("active");
            detInfoForm.parentElement.classList.add("active");
            const catInfo = document.querySelector(".cat-info")
            catInfo.innerHTML = `<img class="img-info" src=${cat.img_link}><p class=catId>id: ${cat.id}</p><p>Имя: ${cat.name}</p><p>Рейтинг: ${cat.rate}</p><p>Возраст: ${cat.age}</p><p>Описание: ${cat.description}</p>`
        }
    })
    closeDetInfoForm.addEventListener("click", () => {
        detInfoForm.classList.remove("active");
        detInfoForm.parentElement.classList.remove("active");
    })


}

function renderCards(arr) {
    arr.forEach(addCard)
}
catsArr.length > 0 && renderCards(catsArr)


addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!popupForm.classList.contains("active")) {
        popupForm.classList.add("active");
        popupForm.parentElement.classList.add("active");
    }
});
closePopupForm.addEventListener("click", () => {
    popupForm.classList.remove("active");
    popupForm.parentElement.classList.remove("active");
})


const getFormValue = (event) => {
    event.preventDefault()
    const id = form.querySelector('[name = "id"]')
    const age = form.querySelector('[name = "age"]')
    const name = form.querySelector('[name = "name"]')
    const rate = form.querySelector('[name = "rate"]')
    const description = form.querySelector('[name = "description"]')
    const favorite = form.querySelector('[name = "favourite"]')
    const img_link = form.querySelector('[name = "img_link"]')
    const data = {
        "name": name.value,
        "img_link": img_link.value,
        "age": age.value,
        "rate": rate.value,
        "favourite": favorite.checked,
        "description": description.value,
        "id": id.value
    }
    const addCat = async (body) => {
        const reqType = await api.addCat(body)
        const response = await reqType.json()
        return response
    }
    if (document.cookie.indexOf('Login') !== -1) {
        addCat(data).then(res => {
            if (res.message === 'ok') {
                catsArr.push(data)
                addCard(data)
                localStorage.setItem("cats", JSON.stringify(catsArr))
                popupForm.classList.remove("active");
                popupForm.parentElement.classList.remove("active");
                form.reset()
            } else {
                alert('Выберите другой id')
            }
        })
    } else {
        alert('Для выполнения действий авторизируйтесь')
    }
}

form.addEventListener('submit', getFormValue)


enterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!authorizForm.classList.contains("active")) {
        authorizForm.classList.add("active");
        authorizForm.parentElement.classList.add("active");
    }
});
closeAuthorizForm.addEventListener("click", () => {
    authorizForm.classList.remove("active");
    authorizForm.parentElement.classList.remove("active");
})


const getValueAuthorizationForm = (event) => {
    event.preventDefault()
    const login = enterForm.querySelector('[name = "login"]')
    document.cookie = `Login=${login.value}; max-age=3600`
    authorizForm.classList.remove("active");
    authorizForm.parentElement.classList.remove("active");
    enterForm.reset()
}

enterForm.addEventListener('submit', getValueAuthorizationForm)

const delCats = (event) => {
    event.preventDefault()
    let answer = confirm(`Вы уверены что хотите удалить котика ${activeName}?`)
    if (answer) {
        const delCat = async (id) => {
            const reqType = await api.delCat(id)
            const response = await reqType.json()
            return response
        }
        delCat(activeIndex).then(res => {
            if (res.message === 'ok') {
                let indexdelEl = catsArr.findIndex(element => element === activeIndex)
                catsArr.splice(indexdelEl, 1)
                localStorage.setItem("cats", JSON.stringify(catsArr))
                detInfoForm.classList.remove("active");
                detInfoForm.parentElement.classList.remove("active");
                window.location.reload(true)
            } else {
                alert("не удалось удалить")
            }
        })
    }
}

delButton.addEventListener('click', delCats)

const catchInfo = (event) => {
    event.preventDefault()
    const newInf = serializeForm(showInfo)
    const updCat = async (id, body) => {
        const reqType = await api.updCat(id, body)
        const response = await reqType.json()
        return response
    }
    updCat(activeIndex, newInf).then(res => {
        if (res.message === 'ok') {
            newCatArr = modifyObj(catsArr, activeIndex, newInf)
            localStorage.setItem("cats", JSON.stringify(newCatArr))
            detInfoForm.classList.remove("active");
            detInfoForm.parentElement.classList.remove("active");
            window.location.reload(true)
        } else {
            alert("не удалось загрузить")
        }
    })
}
changeButton.addEventListener('click', catchInfo)



  