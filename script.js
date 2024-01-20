const calendar = new Date()
let currentMonth = calendar.getMonth()
let currentYear = calendar.getFullYear()
let monthAndYear = document.querySelector('#monthAndYear')
let divAnnotations = document.querySelector('#annotations')
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

renderCalendar(currentMonth, currentYear)

// function que renderiza o calendário por mês
function renderCalendar(month, year) {
    
    let firstDay = new Date(year, month).getDay();
    let lastDay = new Date(year, month+1, 0).getDate()

    let header = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    
    let tableHead = document.querySelector('#calendar-head')
    let tableBody = document.querySelector('#calendar-body')

    monthAndYear.innerHTML = `${months[month]} de ${year}`

    // limpando as células anteriores do cabeçalho
    tableHead.innerHTML = ''

    // criando o cabeçalho
    let tr = document.createElement('tr')
    for(day of header) {
        let th = document.createElement('th')
        let textTh = document.createTextNode(day)
        th.classList.add('cabecalho')
        th.appendChild(textTh)
        tr.appendChild(th)
    }
    tableHead.appendChild(tr)

    // limpando as células anteriores do corpo
    tableBody.innerHTML = ''
    
    // criando o corpo
    
    let date = 1
    // iteração de cada linha
    for(let row = 0; row < 6; row++) {
        
        if(date > lastDay) break
        let tr = document.createElement('tr')

        // iteração de cada coluna
        for(let column = 0; column < 7; column++) {

            if(row === 0 && column < firstDay) {
                // cria espaços vazios antes do 1º dia do mês

                let td = document.createElement('td')
                td.classList.add('blank-space')
                tr.appendChild(td)

            } else if( date > lastDay && column < 7 && column > 0 ) {
                // cria espaços vazios após o último dia do mês

                let td = document.createElement('td')
                td.classList.add('blank-space')
                tr.appendChild(td)

            } else if(date > lastDay) {
                // para o loop casa do tenha passado do último dia do mês
                break
            } else {
                // renderiza o calendário
                let today = calendar.getDate()
                let td = document.createElement('td')
                let textTd = document.createTextNode(date)

                // testando se tem algum lembrete salvo no em cada célula renderizada
                // se tiver, adiciono a class "current" para o dia atual, e "lembrete"
                // para outros dias
                if(localStorage.getItem('daysWithReminder')) {
                    let dia = date < 10 ? `0${date}` : date
                    let dateCurrent = `${dia}/${month+1}/${year}`
                    let objectDays = JSON.parse(localStorage.getItem('daysWithReminder'))
                    objectDays.forEach(value => {
                        if(value.date == dateCurrent) {
                            if(today == date) {
                                td.classList.add('current')  
                            } else {
                                td.classList.add('lembrete')
                            }
                        }
                    })
                }
                
                // testando se a célula renderizada é o dia atual
                if(date == today && month == calendar.getMonth() && year == calendar.getFullYear()) {
                    td.classList.add('today')
                } else {
                    td.classList.add('teste')
                }

                // adicionando linhas e colunas e adicionando um event onclick
                td.appendChild(textTd)
                td.setAttribute('onclick', `checkAnnotation(${date},${month},${year})`)
                tr.appendChild(td)
                date++

            }
        }
        // adicionando o corpo da table
        tableBody.appendChild(tr)
    }

    // renderizando os buttons para avançar para o mês seguinte ou voltar para o anterior
    let divBtn = document.querySelector('#buttons')
    divBtn.innerHTML = ''
    for(let i = 0; i < 2; i++) {

        let btn = document.createElement('button')
        if(i == 0) {
            let textBtn = document.createTextNode('<')
            btn.setAttribute('onclick', 'lastMonth()')
            btn.appendChild(textBtn)
        } else {
            let textBtn = document.createTextNode('>')
            btn.setAttribute('onclick', 'nextMonth()')
            btn.appendChild(textBtn)
        }

        divBtn.appendChild(btn)
    }
}

// function para voltar para o mês anterior
function lastMonth() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1
    renderCalendar(currentMonth, currentYear)
    divAnnotations.innerHTML = ''
    divAnnotations.classList.remove('annotations')
}

// function para avançar para o mês seguinte
function nextMonth() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    renderCalendar(currentMonth, currentYear)
    divAnnotations.innerHTML = ''
    divAnnotations.classList.remove('annotations')
}

// function com event onclick que verifica se já tem algum lembrete no dia clicado
function checkAnnotation(day, month, year) {

    if(localStorage.getItem('daysWithReminder')) {
        showReminder(day, month, year)        
    } else {
        renderFormRegister(day, month, year)
    }
}

// function para mostrar o lembrete
function showReminder(day, month, year) {
    let dia = day < 10 ? `0${day}` : day
    let daysWithReminder = JSON.parse(localStorage.getItem('daysWithReminder'))
    let dateClicked = `${dia}/${month+1}/${year}`

    for(object of daysWithReminder) {
        if(object.date == dateClicked) {

            divAnnotations.innerHTML = ''
            divAnnotations.classList.add('annotations')

            let spanNoteOfDay = document.createElement('span')
            let textSpan = document.createTextNode(`${dia}/${month+1}/${year}`)
            spanNoteOfDay.setAttribute('id', 'note-of-day')
            spanNoteOfDay.appendChild(textSpan)
            
            let reminder = document.createElement('span')
            let textReminder = document.createTextNode(object.text)
            reminder.setAttribute('id','reminder')
            reminder.appendChild(textReminder)

            let btnEditReminder = document.createElement('button')
            let textBtnEdit = document.createTextNode('Editar')
            btnEditReminder.setAttribute('id','edit')
            btnEditReminder.appendChild(textBtnEdit)

            let btnDeleteReminder = document.createElement('button')
            let textBtnDelete = document.createTextNode('Excluir')
            btnDeleteReminder.setAttribute('id', 'delete')
            btnDeleteReminder.appendChild(textBtnDelete)

            let btnCloseReminder = document.createElement('button')
            let textBtnClose = document.createTextNode('Fechar')
            btnCloseReminder.setAttribute('id', 'close')
            btnCloseReminder.appendChild(textBtnClose)              

            divAnnotations.appendChild(spanNoteOfDay)
            divAnnotations.appendChild(reminder)
            divAnnotations.appendChild(btnEditReminder)
            divAnnotations.appendChild(btnDeleteReminder)
            divAnnotations.appendChild(btnCloseReminder)

            btnCloseReminder.onclick = () => hideDivAnnotation()

            btnDeleteReminder.onclick = () => deleteReminder(day, daysWithReminder, object)

            btnEditReminder.onclick = () => editReminder(day, month, year)
            break

        } else {
            renderFormRegister(day, month, year)
        }
    }
}

// function que renderiza o formulário de cadastro de um novo lembrete
function renderFormRegister(day, month, year, textEdit = '') {
    let dia = day < 10 ? `0${day}` : day

    divAnnotations.innerHTML = ''
    divAnnotations.classList.add('annotations')

    let spanNoteOfDay = document.createElement('span')
    let textSpan = document.createTextNode(`${dia}/${month+1}/${year}`)
    spanNoteOfDay.setAttribute('id', 'note-of-day')
    spanNoteOfDay.appendChild(textSpan)

    let textarea = document.createElement('textarea')
    textarea.setAttribute('id', 'text')
    if(textEdit != '') {
        let valueTextarea = document.createTextNode(textEdit)
        textarea.appendChild(valueTextarea)
    }

    let divButtons = document.createElement('div')
    divButtons.classList.add('btn-save-cancel')

    let btnSave = document.createElement('button')
    let textBtnSave = document.createTextNode('Salvar')
    btnSave.setAttribute('id', 'save')
    btnSave.appendChild(textBtnSave)
    
    let btnCancel = document.createElement('button')
    let textBtnCancel = document.createTextNode('Cancelar')
    btnCancel.setAttribute('id', 'cancel')
    btnCancel.appendChild(textBtnCancel)

    divButtons.appendChild(btnSave)
    divButtons.appendChild(btnCancel)

    divAnnotations.appendChild(spanNoteOfDay)
    divAnnotations.appendChild(textarea)
    divAnnotations.appendChild(divButtons)

    // Fechar a tela de cadastramento do lembrete
    btnCancel.onclick = () => hideDivAnnotation()

    // Salvar o lembrete
    btnSave.onclick = () => saveReminder(textarea.value, dia, day, month, year)
}

// function que salva um novo lembrete
function saveReminder(valueTextArea, dia, day, month, year) {
    if(valueTextArea != ''){
        let listTd = document.getElementsByTagName('td')
        for(td of listTd) {
            if(td.innerHTML == day) {
                if(localStorage.getItem('daysWithReminder')) {

                    let dataReminder = {
                        date: `${dia}/${month+1}/${year}`,
                        text: valueTextArea,
                    }
                    
                    let objectDays = JSON.parse(localStorage.getItem('daysWithReminder'))
                    for(obj of objectDays) {
                        if(dataReminder.date == obj.date) {
                            objectDays.splice(objectDays.indexOf(obj) , 1)
                        }
                    }
                    objectDays.push(dataReminder)
                    
                    let newObjectDays = JSON.stringify(objectDays)
                    localStorage.setItem('daysWithReminder', newObjectDays)

                    alert('Lembrete salvo com sucesso!')

                } else {
                    let dataReminder = JSON.stringify([{
                        date: `${dia}/${month+1}/${year}`,
                        text: valueTextArea,
                    }])

                    localStorage.setItem('daysWithReminder', dataReminder)

                    alert('Lembrete salvo com sucesso!')
                }

                let todayCurrent = calendar.getDate()
                if(day == todayCurrent) {
                    td.classList.add('current')
                } else {
                    td.classList.add('lembrete')
                }
            } 

            setTimeout(hideDivAnnotation(), 600)
        } 

    } else {
        alert('Não é possível salvar um lembrete em branco!')
    }
}

// function para editar um lembrete
function editReminder(day, month, year) {

    let dia = day < 10 ? `0${day}` : day
    let daysWithReminder = JSON.parse(localStorage.getItem('daysWithReminder'))
    let editDay = `${dia}/${month+1}/${year}`

    for(reminder of daysWithReminder) {
        if(reminder.date === editDay) {
            renderFormRegister(day, month, year, reminder.text)
        } 
    }

}

// function para deletar um lembrete
function deleteReminder(day, daysWithReminder, object) {
    let listTd = document.getElementsByTagName('td')
        for(td of listTd) {
            if(td.innerHTML == day) {

                // remover o lembrete do localStorage e salvando o novo localStorage
                daysWithReminder.splice(daysWithReminder.indexOf(object) , 1)
                localStorage.setItem('daysWithReminder', JSON.stringify(daysWithReminder))
                
                // remover a class
                td.classList.remove('lembrete')
                td.classList.remove('current')

                // limpar o localStorage caso não tenha nenhum lembrete
                if(JSON.parse(localStorage.getItem('daysWithReminder')).length == 0) {
                    localStorage.clear()
                }

                alert('Lembrete excluido com sucesso!')
                hideDivAnnotation()
            }
        }
}

// function para esconder a div Annotation
function hideDivAnnotation() {
    divAnnotations.innerHTML = ''
    divAnnotations.classList.remove('annotations')
}