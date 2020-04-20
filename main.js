const addTeamForm = document.querySelector('.addTeams__form')

class Teams {

    static ShowTeam(teamName) 
    {

        const spaceForTeams = document.querySelector('.addTeams__spaceForTeams')
        const teamDiv = document.createElement('div')

        teamDiv.textContent = teamName
        teamDiv.classList.add('addTeams__addedTeam')

        spaceForTeams.appendChild(teamDiv)
    }

    static ShowMessage(message)
    {
        const egzistingDivMessage = document.querySelector('.showMessage')

        if(!egzistingDivMessage)
        {

            const divMessage = document.createElement('div')
        
            divMessage.textContent = message
            divMessage.classList.add('showMessage')
    
            document.body.appendChild(divMessage)
    
            const tl = gsap.timeline()
    
            tl.from(divMessage, { opacity: 0, y: 50, ease: Elastic.easeOut.config(1, .4), duration: 1.5 })
            setTimeout(()=>{
                tl.reverse(0).delay(3)

                setTimeout(()=> {
                    divMessage.remove()
                },4500)
            }, 1500)

        }

    }

    static checkName(teamName)
    {
        const teamNames = document.querySelectorAll('.addTeams__addedTeam')

        if(teamNames.length)
        {
            const findTeam = Array.from(teamNames).find(team => team.textContent.toLowerCase() === teamName.toLowerCase())

            return (findTeam && true)
        }

    }

}

addTeamForm.addEventListener('submit', e => {

    e.preventDefault()

    const teamName = document.querySelector('.addTeams__teamName')

    const checkDuplication = Teams.checkName(teamName.value)

    if(!teamName.value)
    {
        Teams.ShowMessage('UZUPEŁNIJ POLE')
    }
    else if(checkDuplication)
    {
        Teams.ShowMessage('TAKA NAZWA DRUŻYNY JUŻ ISTNIEJE')
    }
    else if(teamName.value)
    {
        Teams.ShowTeam(teamName.value)
        teamName.value = ''
    }
})