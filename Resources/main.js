window.currentMenu = 'SwiftClass'

if(localStorage.getItem('swcFirstTime') == null) {
    localStorage.setItem('swcFirstTime', 'true')
    let welcomeSlides = new InfoSlides("Resources/info/json/SwiftClass/slides.json")
    welcomeSlides.render()
}

window.denySettingMovement = false

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

if(localStorage.getItem('swcsettings') == null) localStorage.setItem('swcsettings',
    '[]'
)

window.loadingTips = [
    "Tip: Use Ctrl + and Ctrl - to zoom and scale!",
    "Tip: Themes are coming soon!",
    "Tip: Stay focused. You'll be thankful later!",
    "Tip: Feel free to report any bugs you find to krienskam@gmail.com!",
    "Tip: Besides the using buttons at the bottom to move, you can also press Space to open the quick-move menu!",
]

const menu = new RadialMenu({
    parent: document.getElementById('container'),
    size: 200,
    closeOnClick: true,
    menuItems: [
      { id: 'Classes', title: 'Classes' },
      { id: 'Links', title: 'Links' },
      { id: 'Agendas', title: 'Agendas' },
      { id: 'Settings', title: 'Settings' },
      { id: 'SwiftClass', title: 'Home' },
    ],
    onClick: async function(item) {

      window.currentMenu = item.id
      updateMenus()
    }
  });

window.settingHeaderType = ""

window.openedStatus = false

window.mousePosition = [window.innerWidth / 2, window.innerHeight / 2];

document.addEventListener('mousemove', (event) => {
    window.mousePosition = [event.clientX, event.clientY]
    if(!window.openedStatus){
    document.getElementById('container').style.left = String(window.mousePosition[0] - 1100) + 'px'
    document.getElementById('container').style.top = String(window.mousePosition[1] - 1100) + 'px'
    }
});

document.addEventListener('click', (event) => {
    if(window.openedStatus && !document.getElementById('container').contains(event.target)){
        menu.close()
        window.openedStatus = false
    }
});

window.addEventListener("keyup", async (event) => {
    if(event.keyCode === 32 && event.target == document.body){
        if(!openedStatus){
        event.preventDefault()
        // console.log("Opening menu")
        // console.log(window.mousePosition)

        document.getElementById('container').style.left = String(window.mousePosition[0] - 110) + 'px'
        document.getElementById('container').style.top = String(window.mousePosition[1] - 105) + 'px'

        menu.open()

        window.openedStatus = true
    }
    else
    {
        menu.close()
        await wait(500)
        window.openedStatus = false
    }
}
})

window.addEventListener('keydown', function(e) {
  if (e.keyCode === 32 && e.target === document.body) {
    e.preventDefault();
  }
});

async function updateMenus(){
    let baseContent = document.getElementById('baseContent')
    console.log("Updating menus")
    baseContent.classList.add('smallProp')
    typeMenuName()

    await wait(300)
    
    if(baseContent.classList.contains('forceClassesGrid')){
        baseContent.classList.remove('forceClassesGrid')
    }

    // document.getElementById('topHeader').textContent = ''

    document.getElementById('baseContent').innerHTML = ''

    let tipText = document.createElement('span')
    tipText.classList.add('tipText')
    tipText.id = 'tipText'

    tipText.textContent = window.loadingTips[Math.floor(Math.random() * window.loadingTips.length)]

    // document.getElementById('main').appendChild(tipText)
    // document.getElementById('baseContent').style.display = 'none'

    // await wait(500)

    switch (window.currentMenu) {
        case 'SwiftClass':
            document.getElementById('baseContent').innerHTML = window.SwiftClassPage
            try{
                let jsonRequest = await fetch("Resources/news/display.json")
                let newsJSON = await jsonRequest.json()

                // let newsJSON = {"title": "example"}

                // console.log(newsJSON)

                if('body' in newsJSON)
                {
                    newsJSON.body.forEach(element => {
                        let p = document.getElementById('newsTickerText')
                        p.innerHTML += element + '<br>'
                    });
                }

                if('title' in newsJSON)
                {
                    document.getElementById('newsHeader').textContent = newsJSON.title
                }

                if(newsJSON.image){
                    let newsImage = document.createElement('img')
                    newsImage.src = 'Resources/news/display.png'
                    newsImage.classList.add('newsImage')
                    newsImage.id = 'newsImage'
                    let line = document.createElement('div')
                    line.classList.add('lineBreak')
                    document.getElementById('newsHeader').after(line)
                    document.getElementById('baseContent').appendChild(newsImage)
                }

                }catch(e){
                    console.warn("News fetch error: " + e.stack)
                }
                    break;

                // The settings menu is a bit more complex. It has to fetch the settings list, then create the header buttons based on the unique headers in the settings list, then render the settings of the selected header.

                case 'Settings':
                    // document.getElementById('baseContent').innerHTML = ''


                    let settingsList = await fetch('Resources/settings/list.json')
                    let settingsJSON = await settingsList.json()
                    let allHeaders = []
                    
                    let headerContainer = document.createElement('div')
                    headerContainer.id = 'settingsHeaderContainer'
                    headerContainer.classList.add('settingsHeaderContainer')
                    document.getElementById('baseContent').appendChild(headerContainer)

                    for(let setting of settingsJSON){
                        if(typeof setting.header != 'undefined' && !allHeaders.includes(setting.header)){
                            allHeaders.push(setting.header)
                        }
                    }

                    window.settingHeaderType = allHeaders[0]

                    window.currentMenu = 'Settings' + ' - ' + window.settingHeaderType

                    let valueType = null

                    let settingsLoad = localStorage.getItem('swcsettings')

                    settingsLoad = JSON.parse(settingsLoad)
                    // console.log('Loaded settings: ')
                    // console.log(settingsLoad)

                    settingsJSON.forEach((element) => {
                        // console.log(element)
                        if(!settingsLoad.includes(element.name)){
                            settingsLoad.push(element.name)
                            settingsLoad.push(element.value)
                            localStorage.setItem('swcsettings', JSON.stringify(settingsLoad))
                        }
                        if(element.header == window.settingHeaderType){
                            let setting = new Setting(element.name, settingsLoad[settingsLoad.indexOf(element.name) + 1], element.type, element.description, element.header, element.types, String(element.minval), String(element.maxval), element.selectors)
                            setting.render()
                        }else{
                            // console.log('not of type')
                        }
                    })

                    let headerCont = document.getElementById('settingsHeaderContainer')

                    allHeaders.forEach((item) => {
                        let header = document.createElement('div')

                        header.classList.add('settingsHeader')
                        header.textContent = item
                        header.addEventListener('click', async (event)=> {
                            if(window.denySettingMovement)
                                {return}
                

                            window.settingHeaderType = event.currentTarget.textContent

                            window.currentMenu = 'Settings' + ' - ' + window.settingHeaderType

                            typeMenuName()
                            // window.denySettingMovement = true

                            // console.log(window.settingHeaderType)
                            // console.log(settingsJSON)

                            let liveChildNodes = document.getElementById('baseContent').childNodes
                            // console.log(liveChildNodes.length)
                            if(liveChildNodes && liveChildNodes.length > 1) {
                                while (liveChildNodes.length > 1) {
                                    liveChildNodes[1].remove()
                                }
                            }

                        let valueType = null

                        let settingsLoad = localStorage.getItem('swcsettings')

                        settingsLoad = JSON.parse(settingsLoad)
                        // console.log('Loaded settings: ')
                        // console.log(settingsLoad)

                        settingsJSON.forEach(async (element) => {
                            if(!settingsLoad.includes(element.name)){
                                settingsLoad.push(element.name)
                                settingsLoad.push(element.value)
                                localStorage.setItem('swcsettings', JSON.stringify(settingsLoad))
                            }
                            if(element.header == window.settingHeaderType){
                                let setting = new Setting(element.name, settingsLoad[settingsLoad.indexOf(element.name) + 1], element.type, element.description, element.header, element.types, element.minval, element.maxval, element.selectors)
                                setting.render()
                            }else{
                                // console.log('not of type')
                            }


                        // document.getElementById('topHeader').textContent = ''
                        // for(let i = 0;i < window.currentMenu.length;i++){
                        //     name += window.currentMenu[i]

                        //     await wait(45)

                        //     document.getElementById('topHeader').textContent = name
                        // }

                        // window.denySettingMovement = false

                        })
                        })
                        headerCont.appendChild(header)
                        }
                    )
                    break;
        case 'Classes':
                        baseContent.classList.add('forceClassesGrid')

                        let classesList = localStorage.getItem('swcClasses')

                        if(classesList == null){
                            localStorage.setItem('swcClasses', '[]')
                        }

                        classesList = localStorage.getItem('swcClasses')
                        classesList = JSON.parse(classesList)

                        let classesStack = document.createElement('div')
                        classesStack.classList.add('classesStack')
                        baseContent.appendChild(classesStack)

                        let classesTitle = document.createElement('span')
                        classesTitle.textContent = "Your Classes"
                        classesTitle.classList.add('classesTitle')
                        
                        classesStack.appendChild(classesTitle)

                        classesStack.appendChild(document.createElement('hr'))

                        classesList.forEach((classObject, index) => {
                            let savedObj = classObject
                            let selectionButton = document.createElement('button')
                            selectionButton.textContent = classObject.name
                            selectionButton.classList.add('buttonStacker')
                            selectionButton.addEventListener('click', (event) => {
                                if(savedObj.block == ''){
                                    savedObj.block = '1'
                                }
                                console.log(savedObj.link)
                                let visualClass = new Class(savedObj.name, savedObj.teacher, savedObj.block, savedObj.link, index)
                                visualClass.render()
                            })
                            classesStack.appendChild(selectionButton)
                            classesStack.appendChild(document.createElement('br'))
                        })

                        // Final Button After Full Stack
                            
                       let addClassButton = document.createElement('button')
                       addClassButton.textContent = 'hi'
                    addClassButton.addEventListener('click', classButtonAdder)

                    // Final Button After Full Stack

                    addClassButton.classList.add('addButtonStacker')
                    addClassButton.id = 'addClassButton'
                    addClassButton.textContent = 'Add Class'
                    classesStack.appendChild(addClassButton)
                    document.addEventListener('click', closeMenu)

                    // This was only the beginning of the class menu :p

                    let classesPane = document.createElement('div')
                    classesPane.classList.add('classesPane')
                    baseContent.appendChild(classesPane)
                    classesPane.textContent = 'Click a class on the left to view it. Click the "Add Class" button to add a new class!'
                    break;
                default:
                    document.getElementById('baseContent').innerHTML = `<h1>${window.currentMenu}</h1><p>Content for ${window.currentMenu} will be added soon!</p>`
                break;
    }


async function classButtonAdder(event) {
    if (document.getElementById('addClassContextMenu') != null) document.getElementById('addClassContextMenu').remove()
    let contextMenu = document.createElement('div')
    contextMenu.classList.add('contextMenu')
    contextMenu.classList.add('small')
    contextMenu.id = 'addClassContextMenu'
    document.body.appendChild(contextMenu)
    contextMenu.style.left = String(window.mousePosition[0] - contextMenu.clientWidth / 123123) + 'px'
    contextMenu.style.top = String(window.mousePosition[1] + contextMenu.clientHeight / 10) + 'px'
    contextMenu.classList.remove('small')

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let shortTitle = document.createElement('span')
    shortTitle.textContent = 'Class Creator'
    shortTitle.classList.add('contextTitle')
    contextMenu.appendChild(shortTitle)

    contextMenu.appendChild(document.createElement('hr'))

    let classNameInput = document.createElement('input')
    classNameInput.type = 'text'
    classNameInput.id = 'classNameInput'
    classNameInput.placeholder = 'Type in the name of your class...'
    classNameInput.classList.add('contextInput')
    contextMenu.appendChild(classNameInput)

    contextMenu.appendChild(document.createElement('hr'))

    let classTeacherInput = document.createElement('input')
    classTeacherInput.type = 'text'
    classTeacherInput.id = 'classTeacherInput'
    classTeacherInput.placeholder = 'Type in the name of your teacher...'
    classTeacherInput.classList.add('contextInput')
    contextMenu.appendChild(classTeacherInput)

    contextMenu.appendChild(document.createElement('hr'))

    let classLinkInput = document.createElement('input')
    classLinkInput.type = 'text'
    classLinkInput.id = 'classLinkInput'
    classLinkInput.placeholder = 'Type a link with the class (optional, but recommended)...'
    classLinkInput.classList.add('contextInput')
    contextMenu.appendChild(classLinkInput)

    contextMenu.appendChild(document.createElement('hr'))

    let submitButton = document.createElement('div')
    submitButton.classList.add('contextButton')
    submitButton.textContent = 'Submit and Reload'
    contextMenu.appendChild(submitButton)

    submitButton.addEventListener('click', async (event) => {
        let className = document.getElementById('classNameInput').value
        let classTeacher = document.getElementById('classTeacherInput').value
        let classLink = document.getElementById('classLinkInput').value
        if (className.length == 0 || classTeacher.length == 0) {
            alert('Please fill in at least the class name and teacher fields!')
            return
        }
        if (classLink.length > 0 && !classLink.startsWith('http')) {
            alert('Please enter a valid link that starts with http!')
            return
        }
        if (classLink.length == 0) {
            classLink = ''
        }

        let newClass = {
            name: className,
            teacher: classTeacher,
            link: classLink,
            block: "1"
        }

        let classesList = localStorage.getItem('swcClasses')
        if (classesList == '') classesList = '[]'
        classesList = JSON.parse(classesList)
        classesList.push(newClass)
        localStorage.setItem('swcClasses', JSON.stringify(classesList))
        document.removeEventListener('click', closeMenu)
        document.getElementById('addClassContextMenu').innerHTML = `<span class="contextTitle">Closing in a moment!</span>`
        await wait(500)
        document.getElementById('addClassContextMenu').classList.add('small')
        await wait(100)
        document.getElementById('addClassContextMenu').remove()
        updateMenus()
    })
}




async function closeMenu(event){
    try{
    if(!document.getElementById('addClassContextMenu').contains(event.target) && !document.getElementById('addClassButton').contains(event.target)){
        document.getElementById('addClassContextMenu').classList.add('small')
        await wait(250)
        document.getElementById('addClassContextMenu').remove()
        }
    }catch(e){
        console.warn(e)
    }
}








    // document.getElementById('tipText')?.remove()
    // document.getElementById('baseContent').style.display = 'block'

    window.denySettingMovement = true

    // for(let i = 0; i < window.currentMenu.length;i++){
    //     name += window.currentMenu[i]
    //
    //     await wait(45)
    //
    //     // document.getElementById('topHeader').textContent = name
    // }

    window.denySettingMovement = false

    await wait(300)

    baseContent.classList.remove('smallProp')

    console.log("Updated menus")

    let slidesOpenButton = document.createElement('div')
    slidesOpenButton.classList.add('openSlidesButton')
    slidesOpenButton.textContent = 'i'
    slidesOpenButton.addEventListener('click', () => {
        let infoSlides = new InfoSlides("Resources/info/json/" + window.currentMenu + "/slides.json")
        infoSlides.render()
    })
    document.getElementById('baseContent').appendChild(slidesOpenButton)
}

window.addEventListener('contextmenu', (event) => {
    if(!window.controlKeyPressed){
    event.preventDefault()
    }
});

async function loadMenu(){
    const baseContent = document.getElementById('baseContent')
    const mainParent = baseContent.parentElement
    const newsImage = document.getElementById("newsImage")
    setInterval(() => {
    try{

    // baseContent.style.height = String(mainParent.clientHeight / 1.15) + 'px'
    // baseContent.style.width = String(mainParent.clientWidth / 1.1) + 'px'

    }catch(e){
        console.warn('dimensions err: ' + e)
    }
    }, 5);


    // console.log("HI")

    try{
    let jsonRequest = await fetch("Resources/news/display.json")
    let newsJSON = await jsonRequest.json()
    // console.log(newsJSON)

    if('body' in newsJSON)
    {
        newsJSON.body.forEach(element => {
            let p = document.getElementById('newsTickerText')
            p.textCotent += element
        });
    }

    if('title' in newsJSON)
    {
        document.getElementById('newsHeader').textContent = newsJSON.title
    }

    if(newsJSON.image){
        let newsImage = document.createElement('img')
        newsImage.src = 'Resources/news/display.png'
        newsImage.classList.add('newsImage')
        newsImage.id = 'newsImage'
        let line = document.createElement('div')
        line.classList.add('lineBreak')
        document.getElementById('newsHeader').after(line)
        document.getElementById('baseContent').appendChild(newsImage)
    }

    }catch(e){
        console.warn("News fetch error: " + e.stack)
    }
}

let buttons = document.querySelectorAll(".footerButton")

setInterval(() => {
    console.log(window.denySettingMovement)
}, 100);

async function typeMenuName(){
    window.denySettingMovement = true
        let name = ''
        document.getElementById('topHeader').textContent = '...'
        let nameCache = window.currentMenu
        for(let i = 0;i < nameCache.length;i++){
            name += nameCache[i]
            await wait(45)
            document.getElementById('topHeader').textContent = name
        }
        window.denySettingMovement = false
}

buttons.forEach((element) => {
    if(window.denySettingMovement) return
    element.addEventListener('click', (event) => {
         selfName = event.currentTarget.textContent.trim()
         if(selfName == 'Home') 
         {
            window.currentMenu = 'SwiftClass'
            if(!window.denySettingMovement){
            window.denySettingMovement = true
            updateMenus()
            }
         }else{
            window.currentMenu = selfName
            if(!window.denySettingMovement){
            window.denySettingMovement = true
            updateMenus()
            }
         }
    })
})

// Time Ticker

setInterval(() => {
    let dateObj = new Date()
    let hrs = dateObj.getHours()
    let type = 'AM'
    if(hrs > 12){
        hrs -= 12
        type = 'PM'
    }
    if(hrs == 0){
        hrs = 12
        type = 'AM'
    }
    let mins = String(dateObj.getMinutes())
    if(mins.length == 1) mins = '0' + mins

    let secs = String(dateObj.getSeconds())
    if(secs.length == 1) secs = '0' + secs

    let completeTime = `${hrs}:${mins}:${secs} ${type}`

    document.getElementById('timeTicker').textContent = completeTime

    document.title = 'SwiftClass - ' + completeTime
}, 100);


window.SwiftClassPage = document.getElementById('baseContent').innerHTML

const baseContent = document.getElementById('baseContent')
    const mainParent = baseContent.parentElement
    setInterval(() => {
    try{

    // baseContent.style.height = String(mainParent.clientHeight / 1.15) + 'px'
    // baseContent.style.width = String(mainParent.clientWidth / 1.1) + 'px'
    //
    }catch(e){
        console.warn('dimensions err: ' + e)
    }
    }, 5);

updateMenus()