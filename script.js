document.addEventListener("DOMContentLoaded",function(){
    const searchButton=document.getElementById("search-button");
    const usernameInput=document.getElementById("user-input");

    const statsContainer=document.querySelector(".stats-container");

    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");

    const easyProgressOuterCircle=document.querySelector(".easy-progress-outer-circle");
    const mediumProgressOuterCircle=document.querySelector(".medium-progress-outer-circle");
    const hardProgressOuterCircle=document.querySelector(".hard-progress-outer-circle");

    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");

    const cardsStatsContainer=document.querySelector(".stats-card");

    

    //return true or false based on regular expression
    function validateUserName(username){
        if(username.trim()==""){
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,18}[a-zA-Z0-9]$/;
        const isMatching = regex.test(username); // true or false

        if(!isMatching){
            alert("Invalid Username!!!");
        }
        return isMatching;
    }

    //update the progress or the Circle
    function updateProgress(solved,total,label,circle,outerCircle){
        const progressDegree=(solved/total)*100;
        outerCircle.style.setProperty("--progress-degree",`${progressDegree}%`);

        label.textContent=`${solved} / ${total}`;
    }
    //extract the required data
    function extractRequiredData(data){
        
        const totalQuestions=data.totalQuestions;

        const totalEasy=data.totalEasy;
        const totalMedium=data.totalMedium;
        const totalHard=data.totalHard;

        const totalSolved=data.totalSolved;

        const easySolved=data.easySolved;
        const mediumSolved=data.mediumSolved;
        const hardSolved=data.hardSolved;

        updateProgress(easySolved,totalEasy,easyLabel,easyProgressCircle,easyProgressOuterCircle);
        updateProgress(mediumSolved,totalMedium,mediumLabel,mediumProgressCircle,mediumProgressOuterCircle);
        updateProgress(hardSolved,totalHard,hardLabel,hardProgressCircle,hardProgressOuterCircle);

        const cardData=[
            {label:"Overall Subissions",value:totalSolved},
            {label:"Overall Easy Submissions",value:totalEasy},
            {label:"Overall Medium Submissions",value:totalMedium},
            {label:"Overall Hard Submissions",value:totalHard}
        ];

        cardsStatsContainer.innerHTML=cardData.map(
            data=>{
                return `
                    <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>
                `;
            }
        ).join("");
        statsContainer.style.visibility='visible';


    }

    //to call API
    async function fetchUserData(username){
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`;

        try{
            searchButton.textContent = "Searching....."
            searchButton.disabled = true;

            const response=await fetch(url);

            if(!response.ok){
                throw new Error("Unable to fetch the user Details.....");
            }
            const data=await response.json();
            console.log("Loging data : ",data);
            extractRequiredData(data);
        }
        catch(error){
            statsContainer.innerHTML=`<p>${error.message}</p>`
        }finally{
            searchButton.textContent = "Search"
            searchButton.disabled = false;
        }


    }

    searchButton.addEventListener('click',function(){
        const userName=usernameInput.value;
        console.log("logging username : ",userName);

        if(validateUserName(userName)){

            fetchUserData(userName); //fecting data............
        }
    })
})