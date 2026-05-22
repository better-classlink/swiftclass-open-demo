class Setting {
    constructor(name, value, type, description, header, types, minval, maxval, selectors) {
        this.name = name
        this.value = value
        this.type = type
        this.description = description
        this.header = header
        this.types = types
        this.minval = minval
        this.maxval = maxval
        this.selectors = selectors

        // adding the setting to the "baseContent" element

        // verifying types FIRST

        if (!['bool', 'dropdown', 'color', 'slider'].includes(this.type)) {
            throw new Error("Invalid type: " + this.type)
        }

        // verifying there are no duplicates

        if (document.getElementById(this.name) != null) throw new Error("Duplicate ID: " + this.name)
    }

    render() {
        try {
            // console.log("Rendering setting: " + this.name)
            if (this.type == 'bool') {
                let b = document.createElement('div')
                b.classList.add('boolInteract')
                b.id = this.name

                let t = document.createElement('span')

                t.classList.add('boolHeader')

                t.textContent = this.name

                let i = document.createElement('div')

                i.dataset.imgSource = 'Resources/svg/setting/' + this.value + '.png'

                i.classList.add('boolImageContainer')

                let img = document.createElement('img')

                img.src = i.dataset.imgSource

                i.appendChild(img)

                img.classList.add('boolImage')


                i.addEventListener('click', (event) => {
                    if (this.value == 'off') {
                        this.value = 'on'
                    } else {
                        this.value = 'off'
                    }

                    let settingsLoad = localStorage.getItem('swcsettings')

                    settingsLoad = JSON.parse(settingsLoad)

                    settingsLoad[settingsLoad.indexOf(this.name) + 1] = this.value

                    localStorage.setItem('swcsettings', JSON.stringify(settingsLoad))

                    event.currentTarget.children[0].src = 'Resources/svg/setting/' + this.value + '.png'
                });

                let d = document.createElement('span')

                d.textContent = this.description

                document.getElementById('baseContent').appendChild(b)

                b.appendChild(t)

                b.appendChild(document.createElement('br'))

                b.appendChild(i)

                b.appendChild(d)
            } else if (this.type == 'color') {
                let b = document.createElement('div')
                b.classList.add('boolInteract')
                b.id = this.name

                let t = document.createElement('span')
                t.classList.add('boolHeader')
                t.textContent = this.name

                let i = document.createElement('input')
                i.type = 'color'
                i.value = this.value

                i.classList.add('colorInput')

                i.addEventListener('input', (event) => {
                    this.value = event.currentTarget.value
                    let settingsLoad = localStorage.getItem('swcsettings')
                    settingsLoad = JSON.parse(settingsLoad)
                    settingsLoad[settingsLoad.indexOf(this.name) + 1] = this.value
                    localStorage.setItem('swcsettings', JSON.stringify(settingsLoad))
                });

                let d = document.createElement('span')
                d.textContent = this.description

                document.getElementById('baseContent').appendChild(b)

                b.appendChild(t)

                b.appendChild(document.createElement('br'))

                b.appendChild(i)

                b.appendChild(document.createElement('br'))

                b.appendChild(d)
            } else if (this.type == 'slider') {
                let b = document.createElement('div')
                b.classList.add('boolInteract')
                b.id = this.name

                let t = document.createElement('span')
                t.classList.add('boolHeader')
                t.textContent = this.name

                let v = document.createElement('span')
                v.classList.add('valueDisplay')
                v.textContent = this.value

                let i = document.createElement('input')
                i.type = 'range'
                i.value = this.value
                i.min = this.minval
                console.log(this.maxval)
                console.log(this.minval)
                i.max = this.maxval

                i.classList.add('sliderInput')

                i.addEventListener('input', (event) => {
                    this.value = event.currentTarget.value
                    v.textContent = this.value
                    let settingsLoad = localStorage.getItem('swcsettings')
                    settingsLoad = JSON.parse(settingsLoad)
                    settingsLoad[settingsLoad.indexOf(this.name) + 1] = this.value
                    localStorage.setItem('swcsettings', JSON.stringify(settingsLoad))
                })

                let d = document.createElement('span')
                d.textContent = this.description

                b.appendChild(t)
                b.appendChild(document.createElement('br'))
                b.appendChild(v)
                b.appendChild(document.createElement('br'))
                b.appendChild(i)
                b.appendChild(document.createElement('br'))
                b.appendChild(d)

                document.getElementById('baseContent').appendChild(b)
            } else if (this.type == 'dropdown') {
                let b = document.createElement('div')
                b.classList.add('boolInteract')
                b.id = this.name

                let t = document.createElement('span')
                t.classList.add('boolHeader')
                t.textContent = this.name

                let i = document.createElement('select')
                i.classList.add('dropdownInput')

                this.selectors.forEach((element) => {
                    let option = document.createElement('option')
                    option.value = element
                    option.textContent = element
                    i.appendChild(option)
                });

                i.value = this.value

                i.addEventListener('change', (event) => {
                    let settingsLoad = localStorage.getItem('swcsettings')
                    settingsLoad = JSON.parse(settingsLoad)
                    settingsLoad[settingsLoad.indexOf(this.name) + 1] = event.currentTarget.value
                    localStorage.setItem('swcsettings', JSON.stringify(settingsLoad))
                })

                let d = document.createElement('span')
                d.textContent = this.description

                b.appendChild(t)

                b.appendChild(document.createElement('br'))

                b.appendChild(i)

                b.appendChild(document.createElement('br'))

                b.appendChild(d)

                document.getElementById('baseContent').appendChild(b)
            }

        } catch (e) {
            console.warn(e)
        }

    }
}

window.Setting = Setting

// let testSetting = new Setting('Example Setting', 'off', 'bool', 'This is a test setting')