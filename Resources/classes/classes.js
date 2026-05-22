function getSetting(list, itemName){
    return (list[list.indexOf(itemName) + 1])
}

function br(){
    return document.createElement('br')
}

class Class {
    constructor(name, teacher, block, link, personalIndex) {
        this.name = name
        this.teacher = teacher
        this.block = block
        this.link = link
        this.personalIndex = personalIndex
    }

    render() {
        let allTheSettings = JSON.parse(localStorage.getItem('swcsettings'))
        let c = document.createElement('div')
        c.classList.add('classInteract')
        c.id = this.name
        let t = document.createElement('span')
        t.classList.add('classHeader')
        t.textContent = this.name
        let i = document.createElement('span')
        i.classList.add('classTeacher')
        i.textContent = 'With ' + this.teacher + "."
        let sector = document.createElement('section')
        c.appendChild(sector)
        sector.appendChild(t)
        sector.appendChild(document.createElement('br'))
        sector.appendChild(i)
        c.appendChild(document.createElement('hr'))
        let classesPane = document.querySelectorAll('.classesPane')[0]

        // console.log(allTheSettings)

        let numBlocks = getSetting(allTheSettings, 'Number of Scheduled Blocks')
        if(numBlocks != '1'){
        let blockType = document.createElement('span')
        blockType.classList.add('classGeneric')
        blockType.textContent = "This class is during Block " + this.block + '.'
        c.appendChild(blockType)
        }

        let breaker = document.createElement('br')
        breaker.style.height = '1.5vmin'
        c.appendChild(breaker)

        if(this.link === ''){
            let note = document.createElement('span')
            note.textContent = 'No link was provided for this class.'
            note.classList.add('noteHeaderText')
            // c.appendChild(document.createElement('br'))
            c.appendChild(note)
        }else{
            let clickable = document.createElement('a')
            clickable.classList.add('noteHeaderLink')
            clickable.textContent = 'Associated Link'
            clickable.addEventListener('click', () => {
                window.open(this.link)
            })
            // c.appendChild(document.createElement('br'))
            c.appendChild(clickable)
        }
        console.log(this.personalIndex)
        classesPane.innerHTML = ''
        classesPane.appendChild(c)

        let settingsMenu = document.createElement('div')
        settingsMenu.classList.add('classSettings')
        classesPane.appendChild(settingsMenu)

        let settingsHeader = document.createElement('span')
        settingsHeader.textContent = 'Class Settings'
        settingsHeader.classList.add('classHeader')
        settingsMenu.appendChild(settingsHeader)
        settingsMenu.appendChild(document.createElement('hr'))

        let nameLabel = document.createElement('span')
        nameLabel.classList.add('contextTitle')
        nameLabel.textContent = 'Change class name:'
        nameLabel.style.backgroundColor = 'transparent'
        nameLabel.style.color = 'black'
        settingsMenu.appendChild(nameLabel)
        settingsMenu.appendChild(br())


        let nameInput = document.createElement('input')
        nameInput.classList.add('contextInput')
        settingsMenu.appendChild(nameInput)
        nameInput.placeholder = 'Change the name of the class'
        nameInput.value = this.name
        nameInput.style.maxWidth = '50%'

        let readWrite = JSON.parse(localStorage.getItem('swcClasses'))

        let newName = readWrite[this.personalIndex].name
        let newTeacher = readWrite[this.personalIndex].teacher
        let newLink = readWrite[this.personalIndex].link
        let newBlock = readWrite[this.personalIndex].block

        nameInput.addEventListener('input', (event) => {
            newName = event.currentTarget.value
        })

        settingsMenu.appendChild(document.createElement('hr'))

        let teacherLabel = document.createElement('span')
        teacherLabel.classList.add('contextTitle')
        teacherLabel.textContent = 'Change teacher name:'
        teacherLabel.style.backgroundColor = 'transparent'
        teacherLabel.style.color = 'black'
        settingsMenu.appendChild(teacherLabel)
        settingsMenu.appendChild(br())

        let teacherInput = document.createElement('input')
        teacherInput.classList.add('contextInput')
        settingsMenu.appendChild(teacherInput)
        teacherInput.placeholder = 'Change the name of the class'
        teacherInput.value = this.teacher
        teacherInput.style.maxWidth = '50%'

        teacherInput.addEventListener('input', (event) => {
            newTeacher = event.currentTarget.value
        })

        settingsMenu.appendChild(document.createElement('hr'))

          let linkLabel = document.createElement('span')
        linkLabel.classList.add('contextTitle')
        linkLabel.textContent = 'Change associated link:'
        linkLabel.style.backgroundColor = 'transparent'
        linkLabel.style.color = 'black'
        settingsMenu.appendChild(linkLabel)
        settingsMenu.appendChild(br())

        let linkInput = document.createElement('input')
        linkInput.classList.add('contextInput')
        settingsMenu.appendChild(linkInput)
        linkInput.placeholder = 'Change the link of the class'
        linkInput.value = this.link
        linkInput.style.maxWidth = '50%'

        linkInput.addEventListener('input', (event) => {
            newLink = event.currentTarget.value
        })

        settingsMenu.appendChild(document.createElement('hr'))

        let blockLabel = document.createElement('span')
        blockLabel.classList.add('contextTitle')
        blockLabel.textContent = 'Change scheduled block:'
        blockLabel.style.backgroundColor = 'transparent'
        blockLabel.style.color = 'black'
        settingsMenu.appendChild(blockLabel)
        settingsMenu.appendChild(br())

        let blockInput = document.createElement('select')
        blockInput.classList.add('contextInput')
        blockInput.style.maxWidth = '50%'
        blockInput.style.marginTop = '1%'
        settingsMenu.appendChild(blockInput)

        let numBlocksInt = parseInt(numBlocks)
        for(let i = 1; i <= numBlocksInt; i++){
            let option = document.createElement('option')
            option.value = i
            option.textContent = 'Block ' + i
            blockInput.appendChild(option)
        }
        blockInput.value = this.block

        blockInput.addEventListener('change', (event) => {
            newBlock = event.currentTarget.value
        })

        // setting storage

        let reloadButton = document.createElement('button')
        reloadButton.textContent = 'Update and Reload'

        reloadButton.addEventListener('click', (event) => {
                readWrite[this.personalIndex].name = newName
                readWrite[this.personalIndex].teacher = newTeacher
                readWrite[this.personalIndex].link = newLink
                readWrite[this.personalIndex].block = newBlock
                console.log(readWrite)
                localStorage.setItem('swcClasses', JSON.stringify(readWrite))
                updateMenus()
            })
        reloadButton.classList.add('contextButtonTweak')

        settingsMenu.appendChild(document.createElement('hr'))

        settingsMenu.appendChild(reloadButton)

        let deleteClassButton = document.createElement('button')
        deleteClassButton.textContent = 'Delete Class'
        deleteClassButton.classList.add('contextButtonTweak')
        deleteClassButton.style.marginLeft = '1%'
        deleteClassButton.style.backgroundColor = 'rgb(200, 75, 75)'
        deleteClassButton.addEventListener('click', (event) => {
            if(!confirm('Are you sure you want to delete this class? This action cannot be undone.')){
                return
            }
            let readWrite = JSON.parse(localStorage.getItem('swcClasses'))
            readWrite.splice(this.personalIndex, 1)
            localStorage.setItem('swcClasses', JSON.stringify(readWrite))
            updateMenus()
        })

        settingsMenu.appendChild(deleteClassButton)
    }
}

window.Class = Class