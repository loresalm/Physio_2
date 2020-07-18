////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--VARIABLE--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//main
var COUNT_Q_EXAM = 0
var Q_EXAM_MAX = 20 //CHANGE HERE
var COUNT_Q_ALL = 0
var COUNT_Q_WRONG = 0
var DISPLAY_Q_WRONG = 0 
var COUNT_Q_WRONG_DEL = 0
var TRY_MAX = 3 //CHANGE HERE
var SCORE = 0
var STATE = "END"
var save_reponse= []
var next_state= false
var GREEN = "rgba(100, 230, 122, 0.92)"
var RED = "rgba(245, 92, 92, 0.92)"

//firebase
var DB 
var all_Q
var all_questions
var keys_all
var keys_exam
var wrong_questions
var keys_wrong
var GOT_DATA = false
var tab_response_check= [false, false, false, false,false]


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--INIT--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Init firebase
const firebaseConfig = {
    apiKey: "AIzaSyCUzpbIk250ioh0ji825D1m5jUgug0RRRM",
    authDomain: "physiologieii.firebaseapp.com",
    databaseURL: "https://physiologieii.firebaseio.com",
    projectId: "physiologieii",
    storageBucket: "physiologieii.appspot.com",
    messagingSenderId: "702803266277",
    appId: "1:702803266277:web:68d103f78cc59e5d72220c"
};

firebase.initializeApp(firebaseConfig)
DB = firebase.database();

var ref_Data = DB.ref('Data') 
ref_Data.on('value', gotData, errData)

//Init scene
var BackgroundDiv= document.createElement("Div")
BackgroundDiv.setAttribute("id", "background-div");
document.body.appendChild(BackgroundDiv)

var All = inpt("btnTop",BackgroundDiv, "button")
All.setAttribute("value", "All")
All.setAttribute("onclick", "allQuestion()")
var Exam = inpt("btnTop", BackgroundDiv, "button")
Exam.setAttribute("value", "Exam")
Exam.setAttribute("onclick", "examQuestion()")

var Next = inpt("btnTop", BackgroundDiv, "button")
Next.setAttribute("value", "Next")
Next.setAttribute("onclick", "nextQuestion()")

Next.style.borderRadius= "50%"


var QuestionTextDiv= document.createElement("Div")
QuestionTextDiv.setAttribute("id", "question-text-div");
BackgroundDiv.appendChild(QuestionTextDiv)




var R1 = inpt("btnR", BackgroundDiv, "button")
R1.setAttribute("onclick", "chose("+1+")")

var R1DIV= document.createElement("Div")
R1DIV.setAttribute("id", "response-text-div");
BackgroundDiv.appendChild(R1DIV)

var R2 = inpt("btnR", BackgroundDiv, "button")
R2.setAttribute("onclick", "chose("+2+")")

var R2DIV= document.createElement("Div")
R2DIV.setAttribute("id", "response-text-div");
BackgroundDiv.appendChild(R2DIV)

var R3 = inpt("btnR", BackgroundDiv, "button")
R3.setAttribute("onclick", "chose("+3+")")

var R3DIV= document.createElement("Div")
R3DIV.setAttribute("id", "response-text-div");
BackgroundDiv.appendChild(R3DIV)

var R4 = inpt("btnR", BackgroundDiv, "button")
R4.setAttribute("onclick", "chose("+4+")")

var R4DIV= document.createElement("Div")
R4DIV.setAttribute("id", "response-text-div");
BackgroundDiv.appendChild(R4DIV)

var R5 = inpt("btnR", BackgroundDiv, "button")
R5.setAttribute("onclick", "chose("+5+")")

var R5DIV= document.createElement("Div")
R5DIV.setAttribute("id", "response-text-div");
BackgroundDiv.appendChild(R5DIV)

var ScoreDiv= document.createElement("Div")
ScoreDiv.setAttribute("id", "score-div");
BackgroundDiv.appendChild(ScoreDiv)

var NBQDiv= document.createElement("Div")
NBQDiv.setAttribute("id", "nbq-div");
BackgroundDiv.appendChild(NBQDiv)


R1.setAttribute("value", "A")
R2.setAttribute("value", "B")
R3.setAttribute("value", "C")
R4.setAttribute("value", "D")
R5.setAttribute("value", "E")



displayQuestion()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--FUNCTION--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gotData(data){

	all_Q = data.val()

	all_questions = all_Q[Object.keys(all_Q)[0]]
	keys_all = Object.keys(all_questions)

}

function errData(err){
	console.log("ERROR!")
	console.log(err)
}


function displayQuestion(){ 

	R1.style.backgroundColor = ""
	R2.style.backgroundColor = ""
	R3.style.backgroundColor = ""
	R4.style.backgroundColor = ""
	R5.style.backgroundColor = ""

	R1.style.border = ""
	R1.style.borderColor = ""
	R2.style.border = ""
	R2.style.borderColor = ""
	R3.style.border = ""
	R3.style.borderColor = ""
	R4.style.border = ""
	R4.style.borderColor = ""
	R5.style.border = ""
	R5.style.borderColor = ""

	switch(STATE){

		case "EXAM":
			QuestionTextDiv.innerText = all_questions[keys_exam[COUNT_Q_EXAM]].question
			R1DIV.innerText = all_questions[keys_exam[COUNT_Q_EXAM]].choices[0]
			R2DIV.innerText = all_questions[keys_exam[COUNT_Q_EXAM]].choices[1]
			R3DIV.innerText = all_questions[keys_exam[COUNT_Q_EXAM]].choices[2]
			R4DIV.innerText = all_questions[keys_exam[COUNT_Q_EXAM]].choices[3]
			R5DIV.innerText = all_questions[keys_exam[COUNT_Q_EXAM]].choices[4]
			break;

		case "ALL":
			QuestionTextDiv.innerText = all_questions[keys_all[COUNT_Q_ALL]].question
			R1DIV.innerText = all_questions[keys_all[COUNT_Q_ALL]].choices[0]
			R2DIV.innerText = all_questions[keys_all[COUNT_Q_ALL]].choices[1]
			R3DIV.innerText = all_questions[keys_all[COUNT_Q_ALL]].choices[2]
			R4DIV.innerText = all_questions[keys_all[COUNT_Q_ALL]].choices[3]
			R5DIV.innerText = all_questions[keys_all[COUNT_Q_ALL]].choices[4]
			break;


		case "END":
			QuestionTextDiv.innerText = "PRESS ALL, OR WRONGS"
			R1DIV.innerText = "END"
			R2DIV.innerText = "END"
			R3DIV.innerText = "END"
			R4DIV.innerText = "END"
			R5DIV.innerText = "END"
			break;
	} 
}

function displayScore(i, par, NB_Q){
	NBQDiv.innerText = "QUESTION: "+ (NB_Q + 1) +"  of  "+ par
	switch(i){
		case -1: 
			ScoreDiv.style.background = "white";
			ScoreDiv.innerText = "SCORE=" + SCORE + " / " + par
			break;
		case 0: 
			ScoreDiv.style.background = "tomato";
			ScoreDiv.innerText = "Wrong-->SCORE:"  + SCORE + " / " + par
			break;
		case 1: 
			ScoreDiv.style.background = "lime"
			ScoreDiv.innerText = "Correct-->SCORE:"  + SCORE + " / " + par
			break;
	}

}

function inpt(name, parent, type){

    var inptT = document.createElement("INPUT");
    inptT.setAttribute("name",name);
    inptT.setAttribute("type", type);
    parent.appendChild(inptT)
    return inptT
}


function chose(i){
	

	if (next_state == true){
		switch (i){
			case 1:
				R1.style.border = "10px solid"
				R1.style.borderColor = "rgb(255, 254, 0)"
				break
			case 2:
				R2.style.border = "10px solid"
				R2.style.borderColor = "rgb(255, 254, 0)"
				break

			case 3:
				R3.style.border = "10px solid"
				R3.style.borderColor = "rgb(255, 254, 0)"
				break

			case 4:
				R4.style.border = "10px solid"
				R4.style.borderColor = "rgb(255, 254, 0)"
				break

			case 5:
				R5.style.border = "10px solid"
				R5.style.borderColor = "rgb(255, 254, 0)"
				break
		}
		console.log(tab_response_check[i- 1])
		console.log("befroe")
		if(tab_response_check[i- 1] ==  false){
			save_reponse.push(i)

			tab_response_check[i- 1] = true 
		}
		console.log("save_reponse")
		console.log(save_reponse)
		
	}
}

function nextQuestion(){

	if (next_state == true){



		R1.style.backgroundColor = RED
		R2.style.backgroundColor = RED
		R3.style.backgroundColor = RED
		R4.style.backgroundColor = RED
		R5.style.backgroundColor = RED

		switch(STATE){

			case "EXAM":

				all_questions[keys_exam[COUNT_Q_EXAM]].True.forEach(function(item, index, array) {

					switch (item){
						case 1:
							R1.style.backgroundColor = GREEN
							break
						case 2:
							R2.style.backgroundColor = GREEN
							break

						case 3:
							R3.style.backgroundColor = GREEN
							break

						case 4:
							R4.style.backgroundColor = GREEN
							break

						case 5:
							R5.style.backgroundColor = GREEN
							break
					}
  
				})

				var j = 0
				if(save_reponse.sort().join(',') ===  all_questions[keys_exam[COUNT_Q_EXAM]].True.sort().join(',') && COUNT_Q_EXAM <= Q_EXAM_MAX){
					SCORE++
					j= 1
				}
			
				if(COUNT_Q_EXAM < Q_EXAM_MAX){
					COUNT_Q_EXAM++
					if (COUNT_Q_EXAM== Q_EXAM_MAX){
						STATE = "END"
						displayScore(j, Q_EXAM_MAX, COUNT_Q_EXAM)
						NBQDiv.innerText = "FINISH"
						next_state = false
						break
					}
				}

				displayScore(j, Q_EXAM_MAX, COUNT_Q_EXAM)
				next_state = false
				break;

			case "ALL":


				all_questions[keys_all[COUNT_Q_ALL]].True.forEach(function(item, index, array) {

					switch (item){
						case 1:
							R1.style.backgroundColor = GREEN
							break
						case 2:
							R2.style.backgroundColor = GREEN
							break

						case 3:
							R3.style.backgroundColor = GREEN
							break

						case 4:
							R4.style.backgroundColor = GREEN
							break

						case 5:
							R5.style.backgroundColor = GREEN
							break
					}
  
				})

				var j = 0
				if(save_reponse.sort().join(',') ===  all_questions[keys_all[COUNT_Q_ALL]].True.sort().join(',') && COUNT_Q_ALL <= keys_all.length){
					SCORE++
					j= 1
				}
			
				if(COUNT_Q_ALL < keys_all.length){
					COUNT_Q_ALL++ 
					if(COUNT_Q_ALL == keys_all.length){
						STATE = "END"
						displayScore(j, keys_all.length, COUNT_Q_ALL)
						NBQDiv.innerText = "FINISH"

						next_state = false
						break;
					}
				}

				displayScore(j, keys_all.length, COUNT_Q_ALL)
				next_state = false


				break;

			case "END":
				next_state = false
				break;
		}
	} else {

		if (STATE == "END"){
			displayQuestion()
		}else{
			save_reponse= []
			next_state = true
			tab_response_check= [false, false, false, false,false]
			displayQuestion()
		}

	}
}

function examQuestion(){

	save_reponse= []
	next_state = true
	tab_response_check= [false, false, false, false,false]
	SCORE = 0
	keys_exam = keys_all.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value)
	COUNT_Q_EXAM= 0
	displayScore(-1, Q_EXAM_MAX, COUNT_Q_EXAM)
	STATE = "EXAM"
	displayQuestion()
}

function allQuestion(){
	save_reponse= []
	next_state = true
	tab_response_check= [false, false, false, false,false]
	SCORE = 0
	COUNT_Q_ALL = 0
	STATE = "ALL"
	displayScore(-1, keys_all.length, COUNT_Q_ALL)
	displayQuestion()
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
