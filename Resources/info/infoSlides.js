class InfoSlides{

    constructor(sourceFile){
        this.sourceFile = sourceFile;
    }

    async render(){
        this.slideNumber = 0
        this.slides = await fetch (this.sourceFile).then(() => {
            return fetch(this.sourceFile).then(response => response.json())
        })

        let slidesBase = document.createElement('div')
        slidesBase.id = 'slidesBase'
        slidesBase.classList.add('slidesBase')
        document.body.appendChild(slidesBase)

        let slidesModal = document.createElement('div')
        slidesModal.classList.add('slidesModal')
        slidesBase.appendChild(slidesModal)

        let header = document.createElement('div')
        header.textContent = this.slides[this.slideNumber].title
        header.classList.add('slidesHeader')
        header.id = 'slidesHeader'
        slidesModal.appendChild(header)

        let lineBreaker = document.createElement('div')
        lineBreaker.classList.add('lineBreak')
        slidesModal.appendChild(lineBreaker)

        let body = document.createElement('div')
        body.classList.add('slidesBody')
        body.id = 'slidesBody'
        body.textContent = this.slides[this.slideNumber].body
        slidesModal.appendChild(body)

        console.log(this.slides[this.slideNumber].image)

        let image = document.createElement('img')
        image.id = 'slidesImage'
        if(this.slides[this.slideNumber].image !== undefined){
            image.src = this.slides[this.slideNumber].image
        }else{
            image.src = 'Resources/info/images/default.png'
        }
        image.classList.add('slidesImage')
        if(this.slides[this.slideNumber].image === undefined){
          image.style.display = 'none'
        }
        else{
            image.style.display = 'block'
        }
        slidesModal.appendChild(image)


        let baseContainer = document.createElement('div')
        baseContainer.classList.add('slidesContainerForAnotherContainer')
        slidesModal.appendChild(baseContainer)

        let buttonContainer = document.createElement('div')
        buttonContainer.classList.add('slidesButtonContainer')
        baseContainer.appendChild(buttonContainer)

        let backButton = document.createElement('button')
        backButton.classList.add('slidesButton')
        backButton.id = "slidesBackButton"
        backButton.textContent = 'Previous'
        buttonContainer.appendChild(backButton)

        backButton.addEventListener('click', () => {
            if(this.slideNumber > 0){
                this.slideNumber--
                this.updateSlides()
                document.getElementById('slidesNextButton').textContent = 'Next'
            }
        })

        let nextButton = document.createElement('button')
        nextButton.classList.add('slidesButton')
        nextButton.id = "slidesNextButton"
        nextButton.textContent = 'Next'
        buttonContainer.appendChild(nextButton)

        nextButton.addEventListener('click', (event) => {
            // console.log(this.slideNumber)
            // console.log(this.slides.length)
            if(this.slideNumber < this.slides.length - 1){
                this.slideNumber++
                this.updateSlides()
                if(this.slideNumber == this.slides.length - 1){
                    event.currentTarget.textContent = "Finish"
                    return
                }
            }

            if(this.slideNumber == this.slides.length - 1){
                this.closeSlides()
            }
        })
    }
    updateSlides(){
        let image = document.getElementById('slidesImage')

        if(this.slides[this.slideNumber].image !== undefined){
            image.src = this.slides[this.slideNumber].image
        }
        else{
            image.src = 'Resources/info/images/default.png'
        }

        if(this.slides[this.slideNumber].image === undefined){
            image.style.display = 'none'
        }
        else{
            image.style.display = 'block'
        }

        document.getElementById('slidesHeader').textContent = this.slides[this.slideNumber].title
        document.getElementById('slidesBody').textContent = this.slides[this.slideNumber].body
    }

    closeSlides(){
        document.getElementById('slidesBase').remove()
    }
}

window.InfoSlides = InfoSlides