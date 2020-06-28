class Teams {

    static AddTeam(teamName) 
    {

        const spaceForTeams = document.querySelector('.addTeams__spaceForTeams')
        const teamDiv = document.createElement('div')

        teamDiv.textContent = teamName
        teamDiv.classList.add('addTeams__addedTeam')

        spaceForTeams.appendChild(teamDiv)

        const tl = gsap.timeline()

        tl.from(teamDiv, { opacity: 0, x: 30, duration: .5 })

    }

    static ShowMessage(message)
    {
        const egzistingDivMessage = document.querySelector('.showMessage')

        egzistingDivMessage && egzistingDivMessage.remove()
        const divMessage = document.createElement('div')
        
        divMessage.textContent = message
        divMessage.classList.add('showMessage')

        document.body.appendChild(divMessage)
    
        const tl = gsap.timeline()
    
        tl.from(divMessage, { opacity: 0, y: 50, ease: Elastic.easeOut.config(2, 1),yoyo: true, repeat:1, repeatDelay: 1, duration: 1.5, })

    }

    static CheckName(teamName)
    {
        const teamNames = document.querySelectorAll('.addTeams__addedTeam')

        if(teamNames.length)
        {
            const findTeam = Array.from(teamNames).find(team => team.textContent.toLowerCase() === teamName.toLowerCase())

            return (findTeam && true)
        }

    }

    static RemoveTeam(teamName)
    {
        const tl = gsap.timeline()

        tl.to(teamName, { opacity: 0, x: 30, duration: .5 })

        setTimeout(()=> teamName.remove(), 500)

    }

}

class DisplayTeams {

    constructor()
    {
        this.runAnimationOnce = false
    }

    static ShuffleTeams(teams)
    {
        let shuffledTeams = []

        for(let i of teams)
        {
            shuffledTeams.push(i.textContent)
        }

        let newPos, temp

        for(let i = shuffledTeams.length - 1; i > 0; i--)
        {
            newPos = Math.floor(Math.random() * (i+1))
            temp = shuffledTeams[i]
            shuffledTeams[i] = shuffledTeams[newPos]
            shuffledTeams[newPos] = temp
        }

        this.CreateTable(shuffledTeams)

    }

    static CreateTable(teams)
    {
        const container = document.querySelector('.container')
        const addTeams = document.querySelector('.addTeams')

        const eliminationTable = document.createElement('div')

        eliminationTable.classList.add('displayTeams')

        const tl = gsap.timeline()
        
        tl.to(addTeams, {opacity: 0, duration: .5})
    

        setTimeout(()=> {

            tl.from(eliminationTable, {opacity: 0, duration: .5})

            container.replaceChild(eliminationTable,addTeams)

            let teamsName = []
    
            for(let i = teams.length; i >= 1; i /= 2)
            {
                teamsName.push(i)
            }
    
            for(let i = teamsName.length; i > 0; i--)
            {
                const div = document.createElement('div')
                div.classList.add('displayTeams__ladder')
    
                eliminationTable.appendChild(div)
            }
    
            teamsName.forEach((teamRowNumber,index) => {
    
            const teamsLadder = document.querySelectorAll('.displayTeams__ladder')
    
            for(let i = teamRowNumber; i > 0; i--)
            {
                const div = document.createElement('div')
    
                div.classList.add('displayTeams__teamName')
    
                teamsLadder[index].appendChild(div)
            }
    
            if(index === 0)
            {
                Array.from(teamsLadder[0].children).forEach((team,index) => {
                team.classList.add('displayTeams__teamName')
                team.textContent = teams[index]
                })
            }
    
            })

            eliminationTable.lastChild.firstChild.classList.add('displayTeams__firstPlace')

            this.ChoseWinner()

        },500)

    }

    static ChoseWinner()
    {
       const table = document.querySelector('.displayTeams') 

       Array.from(table.children).forEach(teams => {

        const firstPlace = teams.firstChild.classList.contains('displayTeams__firstPlace')

        if(!firstPlace)
        {

            Array.from(teams.children).forEach((team,id) => {

                team.addEventListener('click', e => {
    
                    const winnerTeam = e.target

                    if(winnerTeam.textContent)
                    {
                        if(Number.isInteger(((id+1)/2) - 1))
                        {
                            //even
        
                            const previousElement = winnerTeam.previousElementSibling.classList.contains('displayTeams__winner')
                            const loserTeam = winnerTeam.previousElementSibling
        
                            this.Promotion(winnerTeam,loserTeam, previousElement, ((id+1)/2) - 1)
                            
                        }
                        else
                        {
                            //odd
        
                            const nextElement = winnerTeam.nextElementSibling.classList.contains('displayTeams__winner')
                            const loserTeam = winnerTeam.nextElementSibling  
        
                            this.Promotion(winnerTeam, loserTeam, nextElement, (Math.floor((id+1)/2)))
                        
                        }
                    }

                    const firstPlce = table.lastChild.textContent
                    const secondPlace = Array.from(table.children[table.children.length - 2].children).find(team => team.classList.contains('displayTeams__loser'))
                    const thirdPlaceTeams = Array.from(table.children[table.children.length - 3].children).filter(team => team.classList.contains('displayTeams__loser'))

                    if(firstPlce && secondPlace && thirdPlaceTeams)
                    {
                        
                        if(!this.runAnimationOnce)
                        {
                            Teams.ShowMessage('Mecz o 3 miejsce')
                            this.runAnimationOnce = true
                        }

                        

                        thirdPlaceTeams.forEach(team => {

                            team.classList.add('displayTeams__thirdPlace')

                            team.addEventListener('click', e => {

                                const thirdPlace = e.target.textContent

                                this.Summary(firstPlce, secondPlace.textContent, thirdPlace)

                            })

                        })

                    }

                })
    
            })

        }

    })

    }

    static Promotion(winnerTeam,loserTeam, preventClickOnLoserTeam, numbrer)
    {
        if(!preventClickOnLoserTeam && loserTeam.textContent )
        {
            winnerTeam.parentNode.nextElementSibling.children[numbrer].textContent = winnerTeam.textContent
            winnerTeam.classList.add('displayTeams__winner')
            loserTeam.classList.add('displayTeams__loser')

        }
    }

    static Summary(firstPlce, secondPlace, thirdPlace) 
    {
        const container = document.querySelector('.container')
        const summary = document.createElement('div')
        const eliminationTable = document.querySelector('.displayTeams')

        summary.classList.add('summary')

        const tl = gsap.timeline()

        const winnerTeams = [firstPlce, secondPlace, thirdPlace]

        for(let i = 1; i <= 3; i++)
        {
            const div = document.createElement('div')

            div.classList.add(`summary__podium${i}`)

            summary.appendChild(div)
        }

        

        tl.to(eliminationTable, { opacity: 0, duration: .5 })

        setTimeout(()=> {
            container.replaceChild(summary, eliminationTable)
            
            tl.from(summary, { opacity: 0, duration: .5 })
    
            winnerTeams.forEach((team, index) => summary.children[index].textContent = team )

        },550)

        

    }

}

const addTeamButton = document.querySelector('.addTeams__button')

addTeamButton.addEventListener('click', e => {

    e.preventDefault()

    const teamName = document.querySelector('.addTeams__teamName')

    const checkDuplication = Teams.CheckName(teamName.value)

    if(!teamName.value)
    {
        Teams.ShowMessage('Uzupełnij pole')
    }
    else if(checkDuplication)
    {
        Teams.ShowMessage('Taka nazwa drużyny już istnieje')
    }
    else if(teamName.value.length > 11)
    {
        Teams.ShowMessage('za długa nazwa drużyny (max 11 znaków)')
    }
    else if(teamName.value)
    {
        Teams.AddTeam(teamName.value)
        teamName.value = ''
    }

    const teams = document.querySelectorAll('.addTeams__addedTeam')

    teams.forEach(team => {

        team.addEventListener('click', e => {
            
            Teams.RemoveTeam(e.target)

        })

    })

})


const teamForm = document.querySelector('.addTeams__form')

teamForm.addEventListener('submit', e => {

    e.preventDefault()

    const teams = document.querySelectorAll('.addTeams__addedTeam')

    if( teams.length === 4 || teams.length === 8)
    {
        DisplayTeams.ShuffleTeams(teams)
    }
    else
    {
        Teams.ShowMessage("Dostępna liczba drużyn to: 4,8")
    }

})